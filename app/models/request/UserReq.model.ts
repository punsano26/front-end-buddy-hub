import type { genderEnum, genderQueryEnum } from '../enums/User.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface IUpdateUserPayload {
  nickname?: string
  description?: string
  gender?: genderEnum
  dateOfBirth?: string
}

export enum BanStatusFilterEnum {
  ALL = 'ALL',
  BANNED = 'BANNED',
  NON_BANNED = 'NON_BANNED'
}

export interface IFindUserFilters {
  sortByGender?: genderQueryEnum
  minAge?: number
  maxAge?: number
  banStatus?: BanStatusFilterEnum
}

export interface IFindAllUsersPaginateQuery extends IBasePaginationRequest, IFindUserFilters {}
