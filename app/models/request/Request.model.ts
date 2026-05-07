import type { IPaginationRequest } from '../Global.model'

export type TBaseParamsId = number | string | string[] | undefined

export type IPartnerIdRequest = {
  partnerId: TBaseParamsId
}

export type IFriendsIdRequest = {
  friendId: TBaseParamsId
}

export interface IBasePaginationRequest extends IPaginationRequest {
  search?: string
}
