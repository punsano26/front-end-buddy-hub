import type { IApiResponse, IApiTokenResponse } from './Response.model'

export interface ICheckAuthData {
  isExisting: boolean
}

export interface IAuthLoginData {
  userId: number
  email: string
  username: string
  profileImg: string | null
  roleName: string
}

export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
export type IAuthLoginResponse = IApiTokenResponse<IAuthLoginData>
