import { defineStore } from 'pinia'

interface IChatState {
  unreadMessageIdsByUserId: Record<number, Record<number, true>>
  activeUserId: number | null
}

export const useChatStore = defineStore('Chat', {
  state: (): IChatState => ({
    unreadMessageIdsByUserId: {},
    activeUserId: null
  }),

  getters: {
    unreadCount: (state: IChatState): number => {
      if (!state.activeUserId) return 0
      return Object.keys(state.unreadMessageIdsByUserId[state.activeUserId] || {}).length
    }
  },

  actions: {
    setActiveUserId (userId: number | null): void {
      this.activeUserId = Number.isFinite(userId as number) && (userId as number) > 0
        ? (userId as number)
        : null
    },

    addUnreadMessageId (messageId: number, userId?: number): void {
      if (!Number.isFinite(messageId) || messageId <= 0) return

      const resolvedUserId = Number.isFinite(userId as number) && (userId as number) > 0
        ? (userId as number)
        : this.activeUserId

      if (!resolvedUserId) return

      if (!this.unreadMessageIdsByUserId[resolvedUserId]) {
        this.unreadMessageIdsByUserId[resolvedUserId] = {}
      }

      if (!this.unreadMessageIdsByUserId[resolvedUserId][messageId]) {
        this.unreadMessageIdsByUserId[resolvedUserId][messageId] = true
      }
    },

    removeUnreadMessageId (messageId: number, userId?: number): void {
      if (!Number.isFinite(messageId) || messageId <= 0) return

      const resolvedUserId = Number.isFinite(userId as number) && (userId as number) > 0
        ? (userId as number)
        : this.activeUserId

      if (!resolvedUserId) return

      const bucket = this.unreadMessageIdsByUserId[resolvedUserId]
      if (!bucket || !bucket[messageId]) return

      const { [messageId]: _, ...rest } = bucket
      this.unreadMessageIdsByUserId[resolvedUserId] = rest as Record<number, true>
    },

    removeUnreadMessageIds (messageIds: number[], userId?: number): void {
      if (!Array.isArray(messageIds) || messageIds.length === 0) return

      messageIds.forEach((messageId: number): void => {
        this.removeUnreadMessageId(messageId, userId)
      })
    },

    resetUnread (userId?: number): void {
      const resolvedUserId = Number.isFinite(userId as number) && (userId as number) > 0
        ? (userId as number)
        : this.activeUserId

      if (!resolvedUserId) return

      this.unreadMessageIdsByUserId[resolvedUserId] = {}
    }
  },

  persist: {
    pick: ['unreadMessageIdsByUserId', 'activeUserId'],
    storage: import.meta.client ? localStorage : undefined
  }
})
