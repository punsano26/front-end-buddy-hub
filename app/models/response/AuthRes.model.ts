import type { IApiResponse, IApiTokenResponse } from './Response.model'

export interface ICheckAuthData {
  exists: boolean
}

export interface IAuthLoginData {
  id: number
  username: string
  email: string
  profileImg: string | null
  isVerified: boolean
  roles: string[]
}

export interface IForgotPasswordData {
  id: number
  username: string
  email: string
  profileImg: string | null
  isVerified: boolean
  roles: string[]
}

export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
export type IAuthLoginResponse = IApiTokenResponse<IAuthLoginData>
export type IForgotPasswordResponse = IApiResponse<IForgotPasswordData>
