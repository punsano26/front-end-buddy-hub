import { defineStore } from 'pinia'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'

interface IFriendState {
  outgoingPendingByFriendId: Record<number, true>
  incomingPendingByFriendId: Record<number, true>
  resolvedStatusByFriendId: Record<number, FriendRequestStatusEnum.ACCEPTED | FriendRequestStatusEnum.REJECTED>
}

function omitKey<T extends Record<number, any>> (source: T, key: number): T {
  const { [key]: _omitted, ...rest } = source
  return rest as T
}

export const useFriendStore = defineStore('Friend', {
  state: (): IFriendState => ({
    outgoingPendingByFriendId: {},
    incomingPendingByFriendId: {},
    resolvedStatusByFriendId: {}
  }),

  actions: {
    markOutgoingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId[friendId] = true
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
    },

    clearOutgoingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
    },

    markIncomingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.incomingPendingByFriendId[friendId] = true
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
    },

    clearIncomingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
    },

    isOutgoingPending (friendId: number): boolean {
      return !!this.outgoingPendingByFriendId[friendId]
    },

    isIncomingPending (friendId: number): boolean {
      return !!this.incomingPendingByFriendId[friendId]
    },

    getResolvedStatus (friendId: number): FriendRequestStatusEnum.ACCEPTED | FriendRequestStatusEnum.REJECTED | null {
      return this.resolvedStatusByFriendId[friendId] || null
    },

    markRequestAccepted (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
      this.resolvedStatusByFriendId[friendId] = FriendRequestStatusEnum.ACCEPTED
    },

    markRequestRejected (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
      this.resolvedStatusByFriendId[friendId] = FriendRequestStatusEnum.REJECTED
    },

    clearResolvedStatus (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
    },

    resetRealtime (): void {
      this.outgoingPendingByFriendId = {}
      this.incomingPendingByFriendId = {}
      this.resolvedStatusByFriendId = {}
    }
  },

  persist: {
    pick: ['outgoingPendingByFriendId', 'incomingPendingByFriendId', 'resolvedStatusByFriendId'],
    storage: import.meta.client ? localStorage : undefined
  }
})
