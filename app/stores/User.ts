import { defineStore } from 'pinia'
import { genderEnum } from '~/models/enums/User.enum'
import type { IFindOneUserDetailData } from '~/models/response/UserRes.model'

interface IUser {
  id: number
  username: string
  nickname?: string | null
  profileImg?: string | null
  bannerImg?: string | null
  gender?: genderEnum
  dateOfBirth?: string
  isOnline?: boolean
}

export const useUserStore = defineStore('User', {
  state: (): { users: IUser[], userDetails: Record<number, IFindOneUserDetailData> } => ({
    users: [] as IUser[],
    userDetails: {}
  }),

  actions: {
    setUsers (users: unknown): void {
      this.users = Array.isArray(users) ? users as IUser[] : []
    },

    setUserDetail (detail: unknown): void {
      if (!detail || typeof detail !== 'object') return

      const data = detail as Partial<IFindOneUserDetailData>

      if (typeof data.id !== 'number') return

      this.userDetails[data.id] = {
        id: data.id,
        profileImg: data.profileImg ?? null,
        bannerImg: data.bannerImg ?? null,
        username: data.username ?? '',
        nickname: data.nickname ?? '',
        email: data.email ?? '',
        description: data.description ?? '',
        createdAt: data.createdAt ?? '',
        age: data.age ?? 0,
        gender: data.gender ?? genderEnum.OTHER,
        dateOfBirth: data.dateOfBirth ?? '',
        isOnline: data.isOnline ?? false,
        lastOnlineAt: data.lastOnlineAt ?? null,
        roles: data.roles ?? [],
        isFriend: data.isFriend ?? false,
        isRequester: data.isRequester ?? false,
        requestStatus: data.requestStatus ?? null
      }
    },

    getUserDetail (userId: number): IFindOneUserDetailData | undefined {
      return this.userDetails[userId]
    }
  }
})
