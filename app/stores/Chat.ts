import { defineStore } from 'pinia'

interface IChatState {
  unreadMessageIds: Record<number, true>
}

export const useChatStore = defineStore('Chat', {
  state: (): IChatState => ({
    unreadMessageIds: {}
  }),

  getters: {
    unreadCount: (state: IChatState): number => Object.keys(state.unreadMessageIds).length
  },

  actions: {
    addUnreadMessageId (messageId: number): void {
      if (!Number.isFinite(messageId) || messageId <= 0) return

      if (!this.unreadMessageIds[messageId]) {
        this.unreadMessageIds[messageId] = true
      }
    },

    removeUnreadMessageId (messageId: number): void {
      if (!Number.isFinite(messageId) || messageId <= 0) return

      if (this.unreadMessageIds[messageId]) {
        const { [messageId]: _, ...rest } = this.unreadMessageIds
        this.unreadMessageIds = rest as Record<number, true>
      }
    },

    removeUnreadMessageIds (messageIds: number[]): void {
      if (!Array.isArray(messageIds) || messageIds.length === 0) return

      messageIds.forEach((messageId: number): void => {
        this.removeUnreadMessageId(messageId)
      })
    },

    resetUnread (): void {
      this.unreadMessageIds = {}
    }
  }
})
