import type { ICreateMessageData } from '~/models/response/ChatRes.model'

interface IUseChatSocketListenerOptions {
  onReceiveMessage: (message: ICreateMessageData) => void
  onMessagesRead: (messageIds: number[]) => void
  onMessageDeleted: (messageId: number) => void
  onMessageEdited: (message: ICreateMessageData) => void
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
    && (typeof value.messageText === 'string' || value.messageText === null || value.messageText === undefined)
}

export const useChatSocketListener = (options: IUseChatSocketListenerOptions): {
  setupSocketListener: () => void
  removeSocketListener: () => void
  startSocketSync: (intervalMs?: number) => void
  stopSocketSync: () => void
} => {
  let isWindowEventsBound = false

  const handleWindowNewMessage = (event: Event): void => {
    const detail = (event as CustomEvent).detail
    if (isChatMessageLike(detail)) {
      options.onReceiveMessage(detail)
    }
  }

  const handleWindowMessagesRead = (event: Event): void => {
    const detail = (event as CustomEvent).detail
    if (Array.isArray(detail)) {
      options.onMessagesRead(detail)
    }
  }

  const handleWindowMessageDeleted = (event: Event): void => {
    const detail = (event as CustomEvent).detail
    if (typeof detail === 'number') {
      options.onMessageDeleted(detail)
    }
  }

  const handleWindowMessageUpdated = (event: Event): void => {
    const detail = (event as CustomEvent).detail
    if (isChatMessageLike(detail)) {
      options.onMessageEdited(detail)
    }
  }

  function bindWindowEvents (): void {
    if (typeof window === 'undefined' || isWindowEventsBound) return
    window.addEventListener('ws:new_message', handleWindowNewMessage)
    window.addEventListener('ws:message_read', handleWindowMessagesRead)
    window.addEventListener('ws:message_deleted', handleWindowMessageDeleted)
    window.addEventListener('ws:message_updated', handleWindowMessageUpdated)
    isWindowEventsBound = true
  }

  function unbindWindowEvents (): void {
    if (typeof window === 'undefined' || !isWindowEventsBound) return
    window.removeEventListener('ws:new_message', handleWindowNewMessage)
    window.removeEventListener('ws:message_read', handleWindowMessagesRead)
    window.removeEventListener('ws:message_deleted', handleWindowMessageDeleted)
    window.removeEventListener('ws:message_updated', handleWindowMessageUpdated)
    isWindowEventsBound = false
  }

  function removeSocketListener (): void {
    unbindWindowEvents()
  }

  function setupSocketListener (): void {
    bindWindowEvents()
  }

  function startSocketSync (_intervalMs?: number): void {
    bindWindowEvents()
  }

  function stopSocketSync (): void {
    unbindWindowEvents()
  }

  return {
    setupSocketListener,
    removeSocketListener,
    startSocketSync,
    stopSocketSync
  }
}
