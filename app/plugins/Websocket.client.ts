import { watch } from 'vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { MatchEvent } from '~/models/enums/Match.enum'
import type { ICreateMessageData, IFindAllConversationsList, IMessageReadStatus } from '~/models/response/ChatRes.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { useFriendStore } from '~/stores/Friend'
import { useMatchStore } from '~/stores/Match'
import { useNotificationStore } from '~/stores/Notification'
import { useUserStore } from '~/stores/User'

type TWebSocketEvent
  = 'users:list'
    | 'new_message'
    | 'message_read'
    | 'message_updated'
    | 'message_deleted'
    | 'new_request'
    | 'request_accepted'
    | 'request_rejected'
    | 'request_cancelled'
    | 'friend_removed'
    | 'new_notification'
    | 'notification_read'
    | 'notification_deleted'
    | MatchEvent

interface IWebSocketPayload {
  event?: TWebSocketEvent | string
  data?: unknown
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function toNumber (value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function isMessageLike (value: unknown): value is ICreateMessageData {
  if (!isRecord(value)) return false

  return typeof value.id === 'number'
    && typeof value.senderId === 'number'
    && typeof value.receiverId === 'number'
    && typeof value.messageType === 'string'
    && typeof value.messageText === 'string'
    && typeof value.createdAt === 'string'
}

function extractMessageReadIds (value: unknown): number[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item: unknown): item is IMessageReadStatus => {
      return isRecord(item) && typeof item.id === 'number'
    })
    .map((item: IMessageReadStatus): number => item.id)
}

export default defineNuxtPlugin((): any => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()
  const friendStore = useFriendStore()
  const matchStore = useMatchStore()
  const chatService: IChatProvider = new ChatProvider()

  let ws: (WebSocket & { __manualClose?: boolean }) | null = null
  let isSyncingUnreadOnLogin = false
  let unreadSyncedUserId: number | null = null

  const notificationAudio = typeof Audio !== 'undefined'
    ? new Audio('/sound/notisound.wav')
    : null

  const notificationAudioPublicChat = typeof Audio !== 'undefined'
    ? new Audio('/sound/notisoundtwo.mp3')
    : null

  if (notificationAudio) {
    notificationAudio.volume = 0.6
  }

  if (notificationAudioPublicChat) {
    notificationAudioPublicChat.volume = 0.6
  }

  const getPublicChatId = (): number | null => {
    if (typeof window === 'undefined') return null

    const match = window.location.pathname.match(/^\/public\/chat\/(\d+)/)
    if (!match) return null

    const parsed = Number(match[1])
    return Number.isFinite(parsed) ? parsed : null
  }

  const playNotificationSound = async (senderId?: number): Promise<void> => {
    const publicChatId = getPublicChatId()
    const usePublicChatSound = publicChatId !== null
      && typeof senderId === 'number'
      && senderId === publicChatId
    const audio = usePublicChatSound ? notificationAudioPublicChat : notificationAudio
    if (!audio) return

    try {
      audio.currentTime = 0
      await audio.play()
    } catch {
      // Autoplay can be blocked; ignore and keep realtime updates.
    }
  }

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

        const lastPage = response.pagination?.lastPage
        totalPage = Number.isFinite(lastPage) && lastPage > 0
          ? Math.floor(lastPage)
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
    const userId = authStore.user.id

    if (!Number.isFinite(userId) || userId <= 0) return

    ws = new WebSocket(
      `${import.meta.env.VITE_ENV_BASE_WS_API}?id=${userId}`
    ) as WebSocket & { __manualClose?: boolean }

    ws.onopen = (): void => {
      console.log('WS connected')
    }

    ws.onmessage = (event: MessageEvent): void => {
      let payload: IWebSocketPayload
      try {
        payload = JSON.parse(event.data) as IWebSocketPayload
      } catch {
        return
      }

      if (!payload || typeof payload.event !== 'string') return

      const userStore = useUserStore()
      const currentUserId = authStore.user.id

      switch (payload.event) {
        case 'users:list': {
          const data = isRecord(payload.data) ? payload.data : null
          const incoming = Array.isArray(data?.data) ? data.data : []
          userStore.setUsers(incoming)
          break
        }

        case 'new_message': {
          if (!isMessageLike(payload.data)) break

          const message = payload.data

          if (currentUserId > 0) {
            chatStore.pushConversationActivityFromMessage(message, currentUserId)
          }

          const isIncoming = message.receiverId === currentUserId

          if (isIncoming && !message.isRead) {
            chatStore.addUnreadMessageId(message.id, currentUserId, message.senderId)
          }

          if (isIncoming) {
            void playNotificationSound(message.senderId)
          }
          break
        }

        case 'message_read': {
          const messageIds = extractMessageReadIds(payload.data)
          if (messageIds.length === 0) break

          chatStore.removeUnreadMessageIds(messageIds, currentUserId)
          break
        }

        case 'message_deleted': {
          if (!isMessageLike(payload.data)) break

          const message = payload.data
          const friendId = message.senderId === currentUserId
            ? message.receiverId
            : message.senderId

          chatStore.removeUnreadMessageId(message.id, currentUserId, friendId)
          break
        }

        case 'message_updated': {
          // Updates are applied in-room via useChatSocketListener.
          break
        }

        case 'new_request': {
          if (!isRecord(payload.data)) break

          const requesterId = toNumber(payload.data.requesterId)
          if (!requesterId || requesterId === currentUserId) break

          // Server emits new_request only to receiver, so currentUser is the receiver.
          friendStore.markIncomingPending(requesterId)
          void playNotificationSound(requesterId)

          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()
          break
        }

        case 'request_accepted':
        case 'request_rejected': {
          if (!isRecord(payload.data) || currentUserId <= 0) break

          const requesterId = toNumber(payload.data.requesterId)
          const receiverId = toNumber(payload.data.receiverId)
          const status = payload.data.status as FriendRequestStatusEnum | undefined

          if (!requesterId || !receiverId) break

          const relatedFriendId = requesterId === currentUserId
            ? receiverId
            : receiverId === currentUserId
              ? requesterId
              : null

          if (!relatedFriendId) break

          if (payload.event === 'request_accepted' || status === FriendRequestStatusEnum.ACCEPTED) {
            friendStore.markRequestAccepted(relatedFriendId)
            void playNotificationSound(relatedFriendId)
          }

          if (payload.event === 'request_rejected' || status === FriendRequestStatusEnum.REJECTED) {
            friendStore.markRequestRejected(relatedFriendId)
          }

          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()
          break
        }

        case 'request_cancelled': {
          if (!isRecord(payload.data) || currentUserId <= 0) break

          const requesterId = toNumber(payload.data.requesterId)
          if (!requesterId || requesterId === currentUserId) break

          friendStore.markRequestCancelled(requesterId)

          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()
          break
        }

        case 'friend_removed': {
          if (!isRecord(payload.data) || currentUserId <= 0) break

          const userId = toNumber(payload.data.userId)
          const friendId = toNumber(payload.data.friendId)
          const removedFriendId = userId === currentUserId
            ? friendId
            : userId

          if (!removedFriendId || removedFriendId === currentUserId) break

          friendStore.markFriendRemoved(removedFriendId)
          break
        }

        case 'new_notification': {
          void playNotificationSound()
          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()
          break
        }

        case MatchEvent.FOUND:
        case MatchEvent.MESSAGE:
        case MatchEvent.EXPIRED:
        case MatchEvent.PARTNER_LEFT:
        case MatchEvent.FRIEND_REQUEST:
        case MatchEvent.PERSISTED: {
          matchStore.pushSocketEvent(payload.event as MatchEvent, payload.data)
          break
        }

        case 'notification_read':
        case 'notification_deleted': {
          // Notifications are consumed by the notification components/pages directly.
          break
        }

        default: {
          break
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
      matchStore.resetRealtime()
    }
  }, { immediate: true })

  watch((): number => authStore.user.id, (userId: number): void => {
    if (!Number.isFinite(userId) || userId <= 0) {
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
