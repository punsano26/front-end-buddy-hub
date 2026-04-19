import type { IApiResponse } from './Response.model'

export interface IFindTheLatestPolicyData {
  id: number
  title: string
  detail: string
  version: string
  isActive: boolean
  createdAt: string
  effectiveAt: string
}

export type IFindTheLatestPolicyResponse = IApiResponse<IFindTheLatestPolicyData>
