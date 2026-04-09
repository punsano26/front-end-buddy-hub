import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IFindOneCurrentUserData {
  id: number
  profileImg: string | null
  bannerImg: string | null
  username: string
  nickname: string
  description: string
  email: string
  createdAt: string
  isVerified: boolean
  age: number
  gender: string
  dateOfBirth: string
}

export interface IUserList {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  gender: string
  isOnline: boolean
  dateOfBirth: string
}

export type IFindOneCurrentUserResponse = IApiResponse<IFindOneCurrentUserData>


export interface IFindAllUsersPaginateResponse extends IBasePaginationResponse<IUserList> {}
