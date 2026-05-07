import type { genderEnum, genderQueryEnum } from '../enums/User.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface IUpdateUserPayload {
  nickname?: string
  description?: string
  gender?: genderEnum
  dateOfBirth?: string
}

export interface IFindUserFilters {
  sortByGender?: genderQueryEnum
  minAge?: number
  maxAge?: number
}

export interface IFindAllUsersPaginateQuery extends IBasePaginationRequest, IFindUserFilters {}
