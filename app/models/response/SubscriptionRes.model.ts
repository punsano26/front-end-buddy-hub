import type { IApiResponse, IBasePaginationResponse } from './Response.model'
import type { IPackage } from './PackageRes.model'

export interface ISubscriptionData {
  id: number
  userId: number
  packageId: number
  packageVersionId: number
  coinTransactionId: number | null
  status: string
  coinPaid: number
  startedAt: string
  expiresAt: string
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  package: IPackage
}

export interface IFindOneSubscriptionByIdResponse extends IApiResponse<ISubscriptionData> {}
export interface IFindAllSubscriptionsPaginateResponse extends IBasePaginationResponse<ISubscriptionData> {}
export interface ICancelSubscriptionResponse extends IApiResponse<ISubscriptionData> {}

// Aliases for backwards compatibility
export type ISubscriptionSuccessResponse = IFindOneSubscriptionByIdResponse
export type ISubscriptionPaginatedResponse = IFindAllSubscriptionsPaginateResponse
