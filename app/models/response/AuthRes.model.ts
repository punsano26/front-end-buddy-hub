import type { deviceTypeEnum } from '../enums/Auth.enum'
import type { IApiResponse, IApiTokenResponse, IBasePaginationResponse } from './Response.model'

export interface ICheckAuthData {
  exists: boolean
}

export interface IAuthLoginData {
  id: number
  username: string
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
export interface IForgotPasswordResponse extends IApiResponse<IForgotPasswordData> {
  resetPasswordToken: string
}

export interface ISessionDataList {
  id: number
  deviceName: string | null
  deviceType: deviceTypeEnum
  ipAddress: string | null
  lastUsedAt: string
  createdAt: string
  isCurrent: boolean
}

export interface IFindAllSessionsPaginateResponse extends IBasePaginationResponse<ISessionDataList> {}
