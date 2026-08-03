import { watch } from 'vue'
import { CallEvent, CallStatusEnum } from '~/models/enums/Call.enum'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { MatchEvent } from '~/models/enums/Match.enum'
import { RentEvent, RentSessionsEvent } from '~/models/enums/Rent.enum'
import type { ICreateMessageData, IFindAllConversationsList, IMessageReadStatus } from '~/models/response/ChatRes.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useAuthStore } from '~/stores/Auth'
import { useCallStore } from '~/stores/Call'
import { useChatStore } from '~/stores/Chat'
import { useFriendStore } from '~/stores/Friend'
import { useMatchStore } from '~/stores/Match'
import { useNotificationStore } from '~/stores/Notification'
import { useRentChatStore } from '~/stores/RentChat'
import { useUserStore } from '~/stores/User'
import { useChatRoomStore } from '~/stores/ChatRoom'

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
    | RentEvent
    | RentSessionsEvent
    | CallEvent

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
  const callStore = useCallStore()
  const chatService: IChatProvider = new ChatProvider()
  const router = useRouter()

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
        totalPage = Number.isFinite(lastPage) && Number(lastPage) > 0
          ? Math.floor(Number(lastPage))
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
    const accessToken = authStore.userToken.accessToken

    if (!Number.isFinite(userId) || userId <= 0) return
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    const wsUrl = accessToken
      ? `${import.meta.env.VITE_ENV_BASE_WS_API}?token=${accessToken}`
      : `${import.meta.env.VITE_ENV_BASE_WS_API}?id=${userId}`

    ws = new WebSocket(wsUrl) as WebSocket & { __manualClose?: boolean }

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
        case 'ping': {
          if (ws && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ event: 'pong', data: {} }))
            } catch {
              // Ignore sending errors
            }
          }
          break
        }

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
          const chatRoomStore = useChatRoomStore()
          chatRoomStore.markMessagesAsRead(messageIds)
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
          if (!requesterId) break

          if (requesterId === currentUserId) {
            const receiverId = toNumber(payload.data.receiverId)
            if (receiverId) {
              friendStore.clearOutgoingPending(receiverId)
            }
          } else {
            friendStore.markRequestCancelled(requesterId)
          }

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

        case RentEvent.HIRE_REQUESTED:
        case RentEvent.HIRE_REJECTED:
        case RentEvent.HIRE_CANCELLED:
        case 'new_notification': {
          void playNotificationSound()
          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()
          break
        }

        case RentEvent.HIRE_ACCEPTED: {
          void playNotificationSound()
          const notificationStore = useNotificationStore()
          void notificationStore.fetchNotifications()

          const data = payload.data
          if (isRecord(data)) {
            const acceptedByUserId = toNumber(data.acceptedByUserId)
            if (acceptedByUserId && acceptedByUserId === currentUserId) {
              break
            }

            const customerId = toNumber(data.customerId)
              || toNumber(data.customer_id)
              || toNumber(data.userId)
              || toNumber(data.user_id)

            const providerId = toNumber(data.providerId)
              || toNumber(data.provider_id)
              || toNumber(data.relatedUserId)
              || toNumber(data.related_user_id)
              || (isRecord(data.provider) ? toNumber(data.provider.id) : null)
              || (isRecord(data.provider) ? toNumber(data.provider.userId) : null)
              || (isRecord(data.provider) ? toNumber(data.provider.user_id) : null)

            const isParticipant = currentUserId > 0 && (
              currentUserId === customerId
              || currentUserId === providerId
            )

            if (isParticipant) {
              const sessionId = toNumber(data.hireSessionId)
                || toNumber(data.hire_session_id)
                || toNumber(data.id)
                || toNumber(data.sessionId)
                || toNumber(data.session_id)
              if (sessionId) {
                void router.push({ name: 'public-rent-chat-id', params: { id: sessionId } })
              }
            }
          }
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

        case CallEvent.CALL_INITIATED: {
          const initiatedData = payload.data as any
          if (initiatedData && typeof initiatedData.callId === 'number') {
            if (!initiatedData.id) {
              initiatedData.id = initiatedData.callId
            }
            callStore.setCallData({
              ...(callStore.callData || {}),
              ...initiatedData,
              id: initiatedData.callId || initiatedData.id
            }, false)
            callStore.setCallStatus(CallStatusEnum.RINGING)
          }
          break
        }

        case CallEvent.CALL_INCOMING: {
          const callData = payload.data as any
          if (callData && typeof callData.callId === 'number' && !callData.id) {
            callData.id = callData.callId
          }
          callStore.setIncomingCallData(callData)
          callStore.setCallStatus(CallStatusEnum.RINGING)
          break
        }

        case CallEvent.CALL_ACCEPTED: {
          const acceptedData = payload.data as any
          if (acceptedData && (acceptedData.callId || acceptedData.id)) {
            const merged = {
              ...(callStore.callData || {}),
              ...acceptedData,
              id: acceptedData.callId || acceptedData.id
            }
            callStore.setCallData(merged, false)
          }
          callStore.setCallStatus(CallStatusEnum.ACCEPTED)
          break
        }

        case CallEvent.CALL_REJECTED: {
          callStore.setCallStatus(CallStatusEnum.ENDED)
          break
        }

        case CallEvent.CALL_ENDED: {
          callStore.setCallStatus(CallStatusEnum.ENDED)
          break
        }

        case CallEvent.CALL_MISSED: {
          callStore.setCallStatus(CallStatusEnum.MISSED)
          break
        }

        case CallEvent.CALL_OFFER: {
          callStore.setRemoteOffer(payload.data as any)
          break
        }

        case CallEvent.CALL_ANSWER: {
          callStore.setRemoteAnswer(payload.data as any)
          break
        }

        case CallEvent.CALL_ICE_CANDIDATE: {
          callStore.addRemoteIceCandidate(payload.data as any)
          break
        }

        case CallEvent.CALL_ERROR: {
          console.error('[Websocket.client] Call error:', payload.data)
          break
        }

        case RentSessionsEvent.SERVICE_NEW_MESSAGE:
        case RentSessionsEvent.SERVICE_MESSAGE_UPDATED:
        case RentSessionsEvent.SERVICE_MESSAGE_DELETED:
        case RentSessionsEvent.SERVICE_MESSAGE_READ:
        case RentSessionsEvent.SESSION_STARTED:
        case RentSessionsEvent.SESSION_EXPIRED:
        case RentSessionsEvent.SESSION_COMPLETED:
        case RentSessionsEvent.SESSION_COMPLETING:
        case RentSessionsEvent.SESSION_COMPLETING_EXPIRED: {
          const rentChatStore = useRentChatStore()
          if (rentChatStore.item?.id) {
            rentChatStore.handleSocketMessage(event, rentChatStore.item.id, currentUserId)
          }
          if (payload.event === RentSessionsEvent.SERVICE_NEW_MESSAGE) {
            void playNotificationSound()
          }
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

    ws.onclose = (closeEvent: CloseEvent): void => {
      console.log('WS disconnected', closeEvent.code, closeEvent.reason)

      const wasManualClose = ws?.__manualClose === true
      ws = null

      if (wasManualClose) return

      if (closeEvent.code === 4001) {
        console.log('[WS] Connection closed with 4001 (Unauthorized). Attempting token refresh...')
        import('~/utils/authRefresh')
          .then(async (m: any): Promise<void> => {
            const isSuccess = await m.forceRefreshToken()
            if (isSuccess) {
              connect()
            } else {
              m.clearPersistedAuth()
              authStore.logout()
              router.push({ name: 'auth-verify' })
            }
          })
          .catch((err: any): void => {
            console.error('[WS] Failed to load authRefresh utility:', err)
          })
        return
      }

      setTimeout((): void => {
        connect()
      }, 3000)
    }
  }

  watch((): string => authStore.userToken.accessToken, (token: string, oldToken?: string): void => {
    if (token) {
      chatStore.setActiveUserId(authStore.user.id)
      void syncUnreadCountOnLogin()
    }

    if (token && (!ws || ws.readyState === WebSocket.CLOSED)) {
      connect()
    }

    if (!token && oldToken) {
      unreadSyncedUserId = null
      isSyncingUnreadOnLogin = false
      chatStore.setActiveUserId(null)
      friendStore.resetRealtime()
      matchStore.resetRealtime()
      callStore.resetCallState()
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

    if (!ws || ws.readyState === WebSocket.CLOSED) {
      connect()
    }
  }, { immediate: true })

  onNuxtReady((): void => {
    if (authStore.userToken.accessToken && (!ws || ws.readyState !== WebSocket.OPEN)) {
      connect()
    }
  })

  return {
    provide: {
      ws: (): any => ws,
      wsConnect: (): void => {
        if (!ws || ws.readyState === WebSocket.CLOSED) {
          connect()
        }
      }
    }
  }
})
