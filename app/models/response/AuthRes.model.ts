import type { IApiResponse, IApiTokenResponse, IMessageResponse } from './Response.model'

export interface IAuthRegisterResponse {
  message: IMessageResponse
}

export interface IForgotPasswordResponse {
  message: IMessageResponse
  resetPasswordToken: string
}
export interface ICheckAuthData {
  isExists: boolean
}

export interface IAuthLoginData {
  id: number
  profileImg: string | null
  roleName: string
}


export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
export type IAuthLoginResponse = IApiTokenResponse<IAuthLoginData>
