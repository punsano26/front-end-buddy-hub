import type { IApiResponse, IApiTokenResponse, IMessageResponse } from './Response.model'

export interface IForgotPasswordResponse {
  message: IMessageResponse
  resetPasswordToken: string
}
export interface ICheckAuthData {
  isExists: boolean
}

export interface IAuthLoginData {
  id: number
  username: string
  profileImg: string | null
  roles: string[]
}


export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
export type IAuthLoginResponse = IApiTokenResponse<IAuthLoginData>
