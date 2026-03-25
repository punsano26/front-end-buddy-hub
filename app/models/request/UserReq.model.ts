import type { genderEnum } from '../enums/User.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface IUpdateUserPayload {
  nickname?: string
  description?: string
  gender?: genderEnum
  dateOfBirth?: string
}

export interface IFindUserFilters {}

export interface IFindAllUsersPaginateQuery extends IBasePaginationRequest, IFindUserFilters {}
