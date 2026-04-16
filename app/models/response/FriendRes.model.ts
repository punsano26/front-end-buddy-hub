import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface ISendAFriendRequestData {
  id: number
  requesterId: number
  receiverId: number
  status: FriendRequestStatusEnum
  createdAt: string
  responseAt: string | null
}

export interface IFindAllRequestList {
  id: number
  requesterId: number
  requesterUsername: string
  requesterNickname: string | null
  requesterProfileImg: string | null
  receiverId: number
  status: FriendRequestStatusEnum
  createdAt: string | Date
  responseAt: string | Date | null
}

export interface IFindAllFriendList {
  id: number
  username: string
  nickname: string
  profileImg: string
  isOnline: boolean
  lastOnlineAt: string
}

export type ISendAFriendRequestResponse = IApiResponse<ISendAFriendRequestData>
export interface IFindAllRequestPaginateResponse extends IBasePaginationResponse<IFindAllRequestList> {}

export interface IFindAllFriendPaginateResponse extends IBasePaginationResponse<IFindAllFriendList> {}
