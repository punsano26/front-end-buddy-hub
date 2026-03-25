import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IFindOneCurrentUserData {
  profileImg: string | null
  bannerImg: string | null
  username: string
  nickname: string
  description: string
  email: string
  createdAt: string
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
  dateOfBirth: string
}

export type IFindOneCurrentUserResponse = IApiResponse<IFindOneCurrentUserData>


export interface IFindAllUsersPaginateResponse extends IBasePaginationResponse<IUserList> {}
