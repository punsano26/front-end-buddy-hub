import type { ICreateMessageData } from '~/models/response/ChatRes.model'

type TEditedMessagePayload = Pick<ICreateMessageData, 'id' | 'messageText'>

interface IUseChatSocketListenerOptions {
  onReceiveMessage: (message: ICreateMessageData) => void
  onMessagesRead: (messageIds: number[]) => void
  onMessageDeleted: (messageId: number) => void
  onMessageEdited: (message: TEditedMessagePayload) => void
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

function extractMessageIds (value: unknown): number[] {
  if (!isRecord(value) || !Array.isArray(value.messageIds)) return []

  return value.messageIds.filter((id: unknown): id is number => typeof id === 'number')
}

function extractMessageId (value: unknown): number | null {
  if (!isRecord(value) || typeof value.messageId !== 'number') return null
  return value.messageId
}

function extractEditedMessage (value: unknown): TEditedMessagePayload | null {
  if (!isRecord(value)) return null
  if (typeof value.id !== 'number' || typeof value.messageText !== 'string') return null

  return {
    id: value.id,
    messageText: value.messageText
  }
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
      try {
        const payload = JSON.parse(event.data) as IWebSocketEventPayload

        switch (payload.event) {
          case 'chat:receive': {
            if (isChatMessageLike(payload.data)) {
              options.onReceiveMessage(payload.data)
            }
            break
          }

          case 'chat:sent': {
            // Optional acknowledgement.
            break
          }

          case 'chat:messages_read_receiver': {
            const messageIds = extractMessageIds(payload.data)
            if (messageIds.length > 0) {
              options.onMessagesRead(messageIds)
            }
            break
          }

          case 'chat:message_deleted_sender':
          case 'chat:message_deleted_receiver': {
            const messageId = extractMessageId(payload.data)
            if (messageId !== null) {
              options.onMessageDeleted(messageId)
            }
            break
          }

          case 'chat:message_edited_sender':
          case 'chat:message_edited_receiver': {
            const editedMessage = extractEditedMessage(payload.data)
            if (editedMessage) {
              options.onMessageEdited(editedMessage)
            }
            break
          }

          default: {
            break
          }
        }
      } catch {
        // Ignore non-JSON websocket payload
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
