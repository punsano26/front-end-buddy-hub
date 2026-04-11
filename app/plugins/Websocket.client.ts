import { watch } from 'vue'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { useUserStore } from '~/stores/User'

export default defineNuxtPlugin((): any => {
  const authStore = useAuthStore()
  const chatStore = useChatStore()

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
          chatStore.addUnreadMessageId(message.id)
        }
      }

      if (data.event === 'chat:messages_read_receiver') {
        const messageIds = Array.isArray(data?.data?.messageIds)
          ? data.data.messageIds as number[]
          : []

        chatStore.removeUnreadMessageIds(messageIds)
      }

      if (data.event === 'chat:message_deleted_sender' || data.event === 'chat:message_deleted_receiver') {
        const messageId = typeof data?.data?.messageId === 'number'
          ? data.data.messageId
          : null

        if (messageId !== null) {
          chatStore.removeUnreadMessageId(messageId)
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
    if (token && (!ws || ws.readyState === WebSocket.CLOSED)) {
      connect()
    }

    if (!token) {
      chatStore.resetUnread()
    }
  }, { immediate: true })

  return {
    provide: {
      ws: (): any => ws
    }
  }
})
