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

export type ISendAFriendRequestResponse = IApiResponse<ISendAFriendRequestData>
export interface IFindAllRequestPaginateResponse extends IBasePaginationResponse<IFindAllRequestList> {}
