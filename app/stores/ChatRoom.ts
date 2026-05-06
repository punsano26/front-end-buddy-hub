import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useChatStore } from './Chat'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData, ICreateMessageResponse } from '~/models/response/ChatRes.model'
import type { IMessageResponse, TErrorResponse } from '~/models/response/Response.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'

export type IChatMessageItem = ICreateMessageData & {
  isSending?: boolean
  isEditing?: boolean
}

const FALLBACK_SEND_ERROR = 'เกิดข้อผิดพลาดระหว่างส่งข้อความ'

interface ISubmitMessageOptions {
  messageText: string
  receiverId: number
  messageType: ICreateMessagePayload['messageType']
  currentUserId: number
  isEditingMessage?: boolean
  editingMessageId?: number | null
  onMessagesUpdated?: () => Promise<void> | void
}

interface IChatRoomState {
  messages: IChatMessageItem[]
  isSubmittingMessage: boolean
  sendError: string
}

function toReadableMessage (value: unknown): string {
  if (typeof value === 'string') return value.trim()

  if (Array.isArray(value)) {
    const firstString = value.find((item: unknown): item is string => typeof item === 'string')
    return firstString?.trim() || ''
  }

  return ''
}

function normalizeErrorMessage (error: TErrorResponse): string {
  const topLevelMessage = toReadableMessage(error?.message)
  if (topLevelMessage) return topLevelMessage


  return FALLBACK_SEND_ERROR
}

export const useChatRoomStore = defineStore('ChatRoom', {
  state: (): IChatRoomState => ({
    messages: [],
    isSubmittingMessage: false,
    sendError: ''
  }),

  actions: {
    setMessages (messages: ICreateMessageData[]): void {
      this.messages = messages
    },

    clearMessages (): void {
      this.messages = []
    },

    setSendError (message: string): void {
      this.sendError = message
    },

    clearSendError (): void {
      this.sendError = ''
    },

    upsertMessage (message: ICreateMessageData | IChatMessageItem): void {
      const existingIndex = this.messages.findIndex((item: IChatMessageItem): boolean => item.id === message.id)

      if (existingIndex >= 0) {
        this.messages[existingIndex] = message
        return
      }

      this.messages.push(message)
    },

    removeMessageById (messageId: number): void {
      this.messages = this.messages.filter((item: IChatMessageItem): boolean => item.id !== messageId)
    },

    replaceMessageById (messageId: number, nextMessage: ICreateMessageData): void {
      let isReplaced = false

      this.messages = this.messages.map((item: IChatMessageItem): IChatMessageItem => {
        if (item.id === messageId) {
          isReplaced = true
          return nextMessage
        }

        return item
      })

      if (!isReplaced) {
        this.messages.push(nextMessage)
      }
    },

    setMessageEditingState (messageId: number, isEditing: boolean): void {
      this.messages = this.messages.map((item: IChatMessageItem): IChatMessageItem => {
        if (item.id !== messageId) return item

        return {
          ...item,
          isEditing
        }
      })
    },

    async editMessage (messageId: number, messageText: string): Promise<boolean> {
      const chatService: IChatProvider = new ChatProvider()
      const { $handleLoading } = useNuxtApp()
      const silentLoadingUnit = ref(false)
      let requestError: TErrorResponse | undefined
      const nextMessageText = messageText.trim()

      if (!nextMessageText || messageId <= 0) return false

      if (!this.messages.some((item: IChatMessageItem): boolean => item.id === messageId)) return false

      this.setMessageEditingState(messageId, true)

      try {
        const editRequest = (): Promise<IMessageResponse> => chatService.updateMessage({ messageId, messageText: nextMessageText })
        const response = await $handleLoading<IMessageResponse>(editRequest, {
          loadingUnit: silentLoadingUnit,
          errorCallBack: (error?: TErrorResponse): void => {
            requestError = error
          }
        })

        if (!response) {
          this.setSendError(normalizeErrorMessage(requestError))
          return false
        }

        this.messages = this.messages.map((item: IChatMessageItem): IChatMessageItem => {
          if (item.id !== messageId) return item

          return {
            ...item,
            messageText: nextMessageText,
            isEditing: false
          }
        })

        return true
      } finally {
        this.setMessageEditingState(messageId, false)
      }
    },

    async sendOptimisticMessage (options: ISubmitMessageOptions): Promise<boolean> {
      const chatService: IChatProvider = new ChatProvider()
      const chatStore = useChatStore()
      const { $handleLoading } = useNuxtApp()
      const silentLoadingUnit = ref(false)
      let requestError: TErrorResponse | undefined
      const nextMessageText = options.messageText.trim()

      if (!nextMessageText) return false

      const payload: ICreateMessagePayload = {
        receiverId: options.receiverId,
        messageType: options.messageType,
        messageText: nextMessageText
      }

      const now = new Date().toISOString()
      const tempMessageId = -(Date.now() + Math.floor(Math.random() * 1000))
      const optimisticMessage: IChatMessageItem = {
        id: tempMessageId,
        senderId: options.currentUserId,
        receiverId: payload.receiverId,
        messageType: payload.messageType,
        messageText: payload.messageText,
        createdAt: now,
        updatedAt: now,
        deletedAt: '',
        isRead: false,
        isSending: true
      }

      this.upsertMessage(optimisticMessage)
      await options.onMessagesUpdated?.()

      try {
        const createRequest = (): Promise<ICreateMessageResponse> => chatService.createMessage(payload)
        const response = await $handleLoading<ICreateMessageResponse>(createRequest, {
          loadingUnit: silentLoadingUnit,
          errorCallBack: (error?: TErrorResponse): void => {
            requestError = error
          }
        })

        if (!response?.data) {
          this.removeMessageById(tempMessageId)
          this.setSendError(normalizeErrorMessage(requestError))
          return false
        }

        const isMessageAlreadySynced = this.messages.some(
          (item: IChatMessageItem): boolean => item.id === response.data.id
        )

        if (isMessageAlreadySynced) {
          this.removeMessageById(tempMessageId)
        } else {
          this.replaceMessageById(tempMessageId, response.data)
        }

        chatStore.pushConversationActivityFromMessage(response.data, options.currentUserId)
        await options.onMessagesUpdated?.()
        return true
      } catch (error: TErrorResponse) {
        this.removeMessageById(tempMessageId)
        throw error
      }
    },

    async submitMessage (options: ISubmitMessageOptions): Promise<boolean> {
      if (this.isSubmittingMessage) return false

      this.isSubmittingMessage = true
      this.clearSendError()

      try {
        const nextMessageText = options.messageText.trim()

        if (!nextMessageText) return false

        if (options.isEditingMessage) {
          const messageId = options.editingMessageId || 0

          return await this.editMessage(messageId, nextMessageText)
        }

        return await this.sendOptimisticMessage({
          ...options,
          messageText: nextMessageText
        })
      } catch (error: TErrorResponse) {
        this.setSendError(normalizeErrorMessage(error))
        return false
      } finally {
        this.isSubmittingMessage = false
      }
    }
  }
})
