import { defineStore } from 'pinia'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'

interface IUser {
  id: number
  username: string
  nickname?: string | null
  profileImg?: string | null
  gender?: string
  dateOfBirth?: string
  isOnline?: boolean
}

export const useUserStore = defineStore('User', {
  state: (): { users: IUser[], userDetails: Record<number, IFindOneCurrentUserData> } => ({
    users: [] as IUser[],
    userDetails: {}
  }),

  actions: {
    setUsers (users: unknown): void {
      this.users = Array.isArray(users) ? users as IUser[] : []
    },

    setUserDetail (detail: unknown): void {
      if (!detail || typeof detail !== 'object') return

      const data = detail as Partial<IFindOneCurrentUserData>

      if (typeof data.id !== 'number') return

      this.userDetails[data.id] = {
        id: data.id,
        profileImg: data.profileImg ?? null,
        bannerImg: data.bannerImg ?? null,
        username: data.username ?? '',
        nickname: data.nickname ?? '',
        description: data.description ?? '',
        email: data.email ?? '',
        createdAt: data.createdAt ?? '',
        isVerified: data.isVerified ?? false,
        age: data.age ?? 0,
        gender: data.gender ?? '',
        dateOfBirth: data.dateOfBirth ?? ''
      }
    },

    getUserDetail (userId: number): IFindOneCurrentUserData | undefined {
      return this.userDetails[userId]
    }
  }
})
