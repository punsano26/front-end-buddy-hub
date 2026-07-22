import type { genderEnum } from '../enums/User.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface ICheckAuthPayload {
  account: string
}

export interface IChangeEmail {
  email: string
}

export interface IChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface IAuthLoginPayload {
  account: string
  password: string
}

export interface IAuthRegisterPayload {
  email: string
  username: string
  password: string
  confirmPassword: string
  gender: genderEnum
  dateOfBirth: string
}

export interface IForgotPasswordPayload {
  email: string
  username: string
}

export interface IResetPasswordPayload {
  newPassword: string
  confirmNewPassword: string
}

export interface IReFreshTokenPayload {
  refreshToken: string
}

export interface IFindSessionsFilters {}

export interface IFindAllSessionsPaginateQuery extends IBasePaginationRequest, IFindSessionsFilters {}
