import { watch } from 'vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { useFriendStore } from '~/stores/Friend'
import { useUserStore } from '~/stores/User'

export default defineNuxtPlugin((): any => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()
  const friendStore = useFriendStore()

  let ws: (WebSocket & { __manualClose?: boolean }) | null = null

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

      const isChatMessageLike = (value: unknown): value is { id: number, receiverId: number, isRead?: boolean } => {
        if (!value || typeof value !== 'object') return false

        const record = value as Record<string, unknown>
        return typeof record.id === 'number' && typeof record.receiverId === 'number'
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

      if (data.event === 'chat:receive') {
        const message = data.data

        if (isChatMessageLike(message) && message.receiverId === currentUserId && !message.isRead) {
          chatStore.addUnreadMessageId(message.id, currentUserId)
        }
      }

      if (data.event === 'chat:messages_read_receiver') {
        const messageIds = Array.isArray(data?.data?.messageIds)
          ? data.data.messageIds as number[]
          : []

        chatStore.removeUnreadMessageIds(messageIds, currentUserId)
      }

      if (data.event === 'chat:message_deleted_sender' || data.event === 'chat:message_deleted_receiver') {
        const messageId = typeof data?.data?.messageId === 'number'
          ? data.data.messageId
          : null

        if (messageId !== null) {
          chatStore.removeUnreadMessageId(messageId, currentUserId)
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
    }

    if (token && (!ws || ws.readyState === WebSocket.CLOSED)) {
      connect()
    }

    if (!token) {
      chatStore.setActiveUserId(null)
      friendStore.resetRealtime()
    }
  }, { immediate: true })

  return {
    provide: {
      ws: (): any => ws
    }
  }
})
