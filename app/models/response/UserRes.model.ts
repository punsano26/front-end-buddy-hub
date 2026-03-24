import type { IApiResponse } from './Response.model'

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

export type IFindOneCurrentUserResponse = IApiResponse<IFindOneCurrentUserData>
