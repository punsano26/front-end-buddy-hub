import type { policyTypeEnum } from '../enums/Policy.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IPolicyData {
  id: number
  title: string
  policyType: policyTypeEnum
  detail: string
  version: string
  isActive: boolean
  createdAt: string
  effectiveAt: string
}

export interface IConsentData {
  id: number
  policyId: number
  userId: number
  acceptedAt: string
}

export interface IConsentStatusData {
  hasConsentedTermsOfUse: boolean
  hasConsentedPrivacyPolicy: boolean
  hasConsentedSafetyInstructions: boolean
}

export type IFindLatestPoliciesResponse = IApiResponse<IPolicyData[]>
export type IFindPolicyDetailResponse = IApiResponse<IPolicyData>
export type IConsentStatusResponse = IApiResponse<IConsentStatusData>
export type IRecordConsentResponse = IApiResponse<IConsentData>
export type IFindPoliciesPaginateResponse = IBasePaginationResponse<IPolicyData>
