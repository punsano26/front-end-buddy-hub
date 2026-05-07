import type { ICreateMessageData, IMessageReadStatus } from '~/models/response/ChatRes.model'

interface IUseChatSocketListenerOptions {
  onReceiveMessage: (message: ICreateMessageData) => void
  onMessagesRead: (messageIds: number[]) => void
  onMessageDeleted: (messageId: number) => void
  onMessageEdited: (message: ICreateMessageData) => void
}

interface IWebSocketEventPayload {
  event?: string
  data?: unknown
}

function isRecord (value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function isChatMessageLike (value: unknown): value is ICreateMessageData {
  if (!isRecord(value)) return false

  return typeof value.id === 'number'
    && typeof value.senderId === 'number'
    && typeof value.receiverId === 'number'
    && typeof value.messageType === 'string'
    && typeof value.messageText === 'string'
}

function extractMessageReadIds (value: unknown): number[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item: unknown): item is IMessageReadStatus => {
      return isRecord(item) && typeof item.id === 'number'
    })
    .map((item: IMessageReadStatus): number => item.id)
}

export const useChatSocketListener = (options: IUseChatSocketListenerOptions): {
  setupSocketListener: () => void
  removeSocketListener: () => void
  startSocketSync: (intervalMs?: number) => void
  stopSocketSync: () => void
} => {
  const { $ws } = useNuxtApp()

  const wsListener = ref<((event: MessageEvent) => void) | null>(null)
  const currentSocket = ref<WebSocket | null>(null)
  const socketSyncInterval = ref<ReturnType<typeof setInterval> | null>(null)

  function removeSocketListener (): void {
    if (currentSocket.value && wsListener.value) {
      currentSocket.value.removeEventListener('message', wsListener.value)
    }

    currentSocket.value = null
    wsListener.value = null
  }

  function setupSocketListener (): void {
    const socket = $ws()

    if (!socket) {
      removeSocketListener()
      return
    }

    if (currentSocket.value === socket && wsListener.value) return

    removeSocketListener()

    const onMessage = (event: MessageEvent): void => {
      let payload: IWebSocketEventPayload
      try {
        payload = JSON.parse(event.data) as IWebSocketEventPayload
      } catch {
        return
      }

      if (!payload || typeof payload.event !== 'string') return

      switch (payload.event) {
        case 'new_message': {
          if (isChatMessageLike(payload.data)) {
            options.onReceiveMessage(payload.data)
          }
          break
        }

        case 'message_read': {
          const messageIds = extractMessageReadIds(payload.data)
          if (messageIds.length > 0) {
            options.onMessagesRead(messageIds)
          }
          break
        }

        case 'message_deleted': {
          if (isChatMessageLike(payload.data)) {
            options.onMessageDeleted(payload.data.id)
          }
          break
        }

        case 'message_updated': {
          if (isChatMessageLike(payload.data)) {
            options.onMessageEdited(payload.data)
          }
          break
        }

        default: {
          break
        }
      }
    }

    socket.addEventListener('message', onMessage)
    currentSocket.value = socket
    wsListener.value = onMessage
  }

  function startSocketSync (intervalMs: number = 200): void {
    stopSocketSync()
    setupSocketListener()
    socketSyncInterval.value = setInterval((): void => {
      setupSocketListener()
    }, intervalMs)
  }

  function stopSocketSync (): void {
    if (socketSyncInterval.value) {
      clearInterval(socketSyncInterval.value)
      socketSyncInterval.value = null
    }
  }

  return {
    setupSocketListener,
    removeSocketListener,
    startSocketSync,
    stopSocketSync
  }
}
