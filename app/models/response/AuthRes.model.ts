import type { IApiResponse, IApiTokenResponse } from './Response.model'

export interface ICheckAuthData {
  isExists: boolean
}

export interface IAuthLoginData {
  id: number
  profileImg: string | null
  roleName: string
}

export interface IAuthRegisterResponse {
  message: string
}

export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
export type IAuthLoginResponse = IApiTokenResponse<IAuthLoginData>
