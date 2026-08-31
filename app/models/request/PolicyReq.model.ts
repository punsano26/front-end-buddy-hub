import type { policyTypeEnum } from '../enums/Policy.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface ICreatePolicyPayload {
  title: string
  policyType?: policyTypeEnum
  detail: string
  version: string
  isActive?: boolean
  effectiveAt?: string | Date
}

export interface IFindPoliciesFilter {
  policyType?: policyTypeEnum
}

export interface IFindPoliciesPaginateQuery extends IBasePaginationRequest, IFindPoliciesFilter {}
