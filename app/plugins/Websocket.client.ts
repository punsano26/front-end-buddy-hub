import { watch } from 'vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import type { ICreateMessageData, IFindAllConversationsList } from '~/models/response/ChatRes.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { useFriendStore } from '~/stores/Friend'
import { useUserStore } from '~/stores/User'

export default defineNuxtPlugin((): any => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()
  const friendStore = useFriendStore()
  const chatService: IChatProvider = new ChatProvider()

  let ws: (WebSocket & { __manualClose?: boolean }) | null = null
  let isSyncingUnreadOnLogin = false
  let unreadSyncedUserId: number | null = null

  const syncUnreadCountOnLogin = async (): Promise<void> => {
    const currentUserId = authStore.user.id
    const accessToken = authStore.userToken.accessToken

    if (!accessToken || currentUserId <= 0) return
    if (isSyncingUnreadOnLogin) return
    if (unreadSyncedUserId === currentUserId) return

    isSyncingUnreadOnLogin = true

    try {
      const unreadCounts: Record<number, number> = {}
      let page = 1
      let totalPage = 1

      while (page <= totalPage) {
        const response = await chatService.findAllConversationsPaginate({
          page,
          limit: 100
        })

        const conversations = response.data || []
        if (conversations.length === 0) break

        const unreadResults = await Promise.allSettled(
          conversations.map((conversation: IFindAllConversationsList): Promise<Awaited<ReturnType<IChatProvider['findAllUnreadMessages']>>> => {
            return chatService.findAllUnreadMessages(conversation.id)
          })
        )

        unreadResults.forEach((result: PromiseSettledResult<Awaited<ReturnType<IChatProvider['findAllUnreadMessages']>>>, index: number): void => {
          if (result.status !== 'fulfilled') return

          const targetConversation = conversations[index]
          if (!targetConversation) return

          const unreadCount = result.value.data?.unreadCount ?? 0
          if (!Number.isFinite(unreadCount) || unreadCount <= 0) return

          unreadCounts[targetConversation.id] = Math.floor(unreadCount)
        })

        totalPage = Number.isFinite(response.totalPage) && response.totalPage > 0
          ? Math.floor(response.totalPage)
          : 1

        page += 1
      }

      chatStore.setConversationUnreadCounts(unreadCounts, currentUserId)
      unreadSyncedUserId = currentUserId
    } catch {
      // Ignore login unread sync failures and keep realtime updates via websocket.
    } finally {
      isSyncingUnreadOnLogin = false
    }
  }

  const connect = (): void => {
    const token = authStore.userToken.accessToken

    if (!token) return

    ws = new WebSocket(
      `${import.meta.env.VITE_ENV_BASE_WS_API}?token=${token}`
    ) as WebSocket & { __manualClose?: boolean }

    ws.onopen = (): void => {
      console.log('WS connected')
    }

    ws.onmessage = (event: MessageEvent): void => {
      const data = JSON.parse(event.data)
      const userStore = useUserStore()
      const currentUserId = authStore.user.id

      const toNumber = (value: unknown): number | null => {
        if (typeof value === 'number' && Number.isFinite(value)) return value
        if (typeof value === 'string') {
          const parsed = Number(value)
          return Number.isFinite(parsed) ? parsed : null
        }
        return null
      }

      const isChatMessageLike = (value: unknown): value is { id: number, senderId: number, receiverId: number, isRead?: boolean } => {
        if (!value || typeof value !== 'object') return false

        const record = value as Record<string, unknown>
        return typeof record.id === 'number'
          && typeof record.senderId === 'number'
          && typeof record.receiverId === 'number'
      }

      const isConversationActivityMessageLike = (
        value: unknown
      ): value is Pick<ICreateMessageData, 'senderId' | 'receiverId' | 'messageText' | 'createdAt' | 'messageType'> => {
        if (!value || typeof value !== 'object') return false

        const record = value as Record<string, unknown>
        return typeof record.senderId === 'number'
          && typeof record.receiverId === 'number'
          && typeof record.messageText === 'string'
          && typeof record.createdAt === 'string'
          && typeof record.messageType === 'string'
      }

      if (data.event === 'users:update' || data.event === 'users:list' || data.event === 'users:paginate:response') {
        const incoming = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.users)
            ? data.data.users
            : Array.isArray(data.users)
              ? data.users
              : data.data && typeof data.data === 'object'
                ? Object.values(data.data)
                : []

        userStore.setUsers(incoming)
      }

      if (data.event === 'user:detail' || data.event === 'user:detail:response' || data.event === 'users:detail:update') {
        const detail = data.data?.user ?? data.user ?? data.data
        userStore.setUserDetail(detail)
      }

      if (data.event === 'chat:receive' || data.event === 'chat:sent') {
        const message = data.data

        if (isConversationActivityMessageLike(message) && currentUserId > 0) {
          chatStore.pushConversationActivityFromMessage(message, currentUserId)
        }
      }

      if (data.event === 'chat:receive') {
        const message = data.data

        if (isChatMessageLike(message) && message.receiverId === currentUserId && !message.isRead) {
          chatStore.addUnreadMessageId(message.id, currentUserId, message.senderId)
        }
      }

      if (data.event === 'chat:messages_read_receiver') {
        const messageIds = Array.isArray(data?.data?.messageIds)
          ? data.data.messageIds as number[]
          : []

        const friendId = toNumber(data?.data?.friendId)
          ?? toNumber(data?.data?.senderId)
          ?? toNumber(data?.data?.receiverId)

        chatStore.removeUnreadMessageIds(messageIds, currentUserId, friendId ?? undefined)
      }

      if (data.event === 'chat:message_deleted_sender' || data.event === 'chat:message_deleted_receiver') {
        const messageId = typeof data?.data?.messageId === 'number'
          ? data.data.messageId
          : null

        const friendId = toNumber(data?.data?.friendId)
          ?? toNumber(data?.data?.senderId)
          ?? toNumber(data?.data?.receiverId)

        if (messageId !== null) {
          chatStore.removeUnreadMessageId(messageId, currentUserId, friendId ?? undefined)
        }
      }

      if (data.event === 'friend:request_sender') {
        const payload = data?.data ?? data
        const requesterId = toNumber(payload?.requesterId)
        const receiverId = toNumber(payload?.receiverId)

        if (requesterId === currentUserId && receiverId) {
          friendStore.markOutgoingPending(receiverId)
        }
      }

      if (data.event === 'friend:request_receiver') {
        const payload = data?.data ?? data
        const requesterId = toNumber(payload?.requesterId)
        const receiverId = toNumber(payload?.receiverId)

        // Receiver event is listened with exact backend name for realtime extension points.
        if (receiverId === currentUserId && requesterId) {
          friendStore.markIncomingPending(requesterId)
        }
      }

      if (data.event === 'friend:request_accepted' || data.event === 'friend:request_rejected') {
        const payload = data?.data ?? data
        const requesterId = toNumber(payload?.requesterId)
        const receiverId = toNumber(payload?.receiverId)
        const status = payload?.status as FriendRequestStatusEnum | undefined

        if (!currentUserId || !requesterId || !receiverId) return

        const relatedFriendId = requesterId === currentUserId
          ? receiverId
          : receiverId === currentUserId
            ? requesterId
            : null

        if (!relatedFriendId) return

        if (status === FriendRequestStatusEnum.ACCEPTED || data.event === 'friend:request_accepted') {
          friendStore.markRequestAccepted(relatedFriendId)
        }

        if (status === FriendRequestStatusEnum.REJECTED || data.event === 'friend:request_rejected') {
          friendStore.markRequestRejected(relatedFriendId)
        }
      }
    }

    ws.onclose = (): void => {
      console.log('WS disconnected')

      const wasManualClose = ws?.__manualClose === true
      ws = null

      if (wasManualClose) return

      setTimeout((): void => {
        connect()
      }, 3000)
    }
  }

  watch((): string => authStore.userToken.accessToken, (token: string): void => {
    if (token) {
      chatStore.setActiveUserId(authStore.user.id)
      void syncUnreadCountOnLogin()
    }

    if (token && (!ws || ws.readyState === WebSocket.CLOSED)) {
      connect()
    }

    if (!token) {
      unreadSyncedUserId = null
      isSyncingUnreadOnLogin = false
      chatStore.setActiveUserId(null)
      friendStore.resetRealtime()
    }
  }, { immediate: true })

  watch((): number => authStore.user.id, (userId: number): void => {
    if (userId <= 0) {
      unreadSyncedUserId = null
      return
    }

    if (!authStore.userToken.accessToken) return

    chatStore.setActiveUserId(userId)
    void syncUnreadCountOnLogin()
  }, { immediate: true })

  return {
    provide: {
      ws: (): any => ws
    }
  }
})
