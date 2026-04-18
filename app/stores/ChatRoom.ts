import { defineStore } from 'pinia'
import { useChatStore } from './Chat'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import type { TErrorResponse } from '~/models/response/Response.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'

export type IChatMessageItem = ICreateMessageData & {
  isSending?: boolean
}

interface ISubmitMessageOptions {
  messageText: string
  receiverId: number
  messageType: ICreateMessagePayload['messageType']
  currentUserId: number
  isEditingMessage?: boolean
  onEditMessage?: (messageText: string) => Promise<void>
  onMessagesUpdated?: () => Promise<void> | void
}

interface IChatRoomState {
  messages: IChatMessageItem[]
  isSubmittingMessage: boolean
  sendError: string
}

function normalizeErrorMessage (error: TErrorResponse): string {
  return error?.message || 'เกิดข้อผิดพลาดระหว่างส่งข้อความ'
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

    async sendOptimisticMessage (options: ISubmitMessageOptions): Promise<boolean> {
      const chatService: IChatProvider = new ChatProvider()
      const chatStore = useChatStore()
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
        const response = await chatService.createMessage(payload)

        if (!response.data) {
          this.removeMessageById(tempMessageId)
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
          if (!options.onEditMessage) return false

          await options.onEditMessage(nextMessageText)
          return true
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
