import { defineStore } from 'pinia'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'

interface IFriendState {
  outgoingPendingByFriendId: Record<number, true>
  incomingPendingByFriendId: Record<number, true>
  resolvedStatusByFriendId: Record<number, FriendRequestStatusEnum.ACCEPTED | FriendRequestStatusEnum.REJECTED>
  removedByFriendId: Record<number, true>
}

function omitKey<T extends Record<number, any>> (source: T, key: number): T {
  const { [key]: _omitted, ...rest } = source
  return rest as T
}

export const useFriendStore = defineStore('Friend', {
  state: (): IFriendState => ({
    outgoingPendingByFriendId: {},
    incomingPendingByFriendId: {},
    resolvedStatusByFriendId: {},
    removedByFriendId: {}
  }),

  actions: {
    markOutgoingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId[friendId] = true
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
      this.removedByFriendId = omitKey(this.removedByFriendId, friendId)
    },

    clearOutgoingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
    },

    markIncomingPending (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.incomingPendingByFriendId[friendId] = true
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
      this.removedByFriendId = omitKey(this.removedByFriendId, friendId)
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

    isRemoved (friendId: number): boolean {
      return !!this.removedByFriendId[friendId]
    },

    markRequestAccepted (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
      this.resolvedStatusByFriendId[friendId] = FriendRequestStatusEnum.ACCEPTED
      this.removedByFriendId = omitKey(this.removedByFriendId, friendId)
    },

    markRequestRejected (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
      this.resolvedStatusByFriendId[friendId] = FriendRequestStatusEnum.REJECTED
      this.removedByFriendId = omitKey(this.removedByFriendId, friendId)
    },

    markFriendRemoved (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.outgoingPendingByFriendId = omitKey(this.outgoingPendingByFriendId, friendId)
      this.incomingPendingByFriendId = omitKey(this.incomingPendingByFriendId, friendId)
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
      this.removedByFriendId[friendId] = true
    },

    clearRemoved (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.removedByFriendId = omitKey(this.removedByFriendId, friendId)
    },

    clearResolvedStatus (friendId: number): void {
      if (!Number.isFinite(friendId) || friendId <= 0) return
      this.resolvedStatusByFriendId = omitKey(this.resolvedStatusByFriendId, friendId)
    },

    resetRealtime (): void {
      this.outgoingPendingByFriendId = {}
      this.incomingPendingByFriendId = {}
      this.resolvedStatusByFriendId = {}
      this.removedByFriendId = {}
    }
  },

  persist: {
    pick: ['outgoingPendingByFriendId', 'incomingPendingByFriendId', 'resolvedStatusByFriendId', 'removedByFriendId'],
    storage: import.meta.client ? localStorage : undefined
  }
})
