import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { genderEnum } from '../enums/User.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IFindOneCurrentUserData {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  email: string
  bannerImg: string | null
  isOnline: boolean
  description: string | null
  gender: genderEnum
  dateOfBirth: string
  age: number
  lastOnlineAt: string | null
  createdAt: string
  roles: string[]
}

export interface IFindOneUserDetailData extends IFindOneCurrentUserData {
  isFriend: boolean
  isRequester: boolean
  requestStatus: FriendRequestStatusEnum | null
}

export interface IUserList {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  bannerImg: string | null
  isOnline: boolean
}

export type IFindOneCurrentUserResponse = IApiResponse<IFindOneCurrentUserData>
export type IFindOneUserDetailResponse = IApiResponse<IFindOneUserDetailData>


export interface IFindAllUsersPaginateResponse extends IBasePaginationResponse<IUserList> {}
