import type { genderEnum } from '../enums/User.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface IUpdateUserPayload {
  nickname?: string
  description?: string
  email?: string
  gender?: genderEnum
  dateOfBirth?: string
}

export interface IFindUserFilters {
  gender?: genderEnum
}

export interface IFindAllUsersPaginateQuery extends IBasePaginationRequest, IFindUserFilters {}
