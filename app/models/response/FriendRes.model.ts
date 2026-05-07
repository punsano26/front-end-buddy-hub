import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface ISendAFriendRequestData {
  id: number
  requesterId: number
  requesterUsername: string
  requesterNickname: string | null
  requesterProfileImg: string | null
  receiverId: number
  status: FriendRequestStatusEnum
  createdAt: string
  respondedAt: string | null
}

export interface IRemoveFriendData {
  userId: number
  friendId: number
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
  respondedAt: string | Date | null
}

export interface IFindAllFriendList {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  isOnline: boolean
  lastOnlineAt: string | null
}

export type ISendAFriendRequestResponse = IApiResponse<ISendAFriendRequestData>
export type IRemoveFriendResponse = IApiResponse<IRemoveFriendData>
export interface IFindAllRequestPaginateResponse extends IBasePaginationResponse<IFindAllRequestList> {}

export interface IFindAllFriendPaginateResponse extends IBasePaginationResponse<IFindAllFriendList> {}
