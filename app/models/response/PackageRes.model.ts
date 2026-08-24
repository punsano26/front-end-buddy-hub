import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IPackageData {
  id: number
  name: string
  description: string | null
  durationDays: number
  coinPrice: number
  discount: number
  iconUrl: string | null
  isBestValue: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}


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

export interface IPackage {
  id: number
  name: string
  description: string | null
}

export interface IFindOnePackageByIdResponse extends IApiResponse<IPackageData> {}
export interface IFindAllPackagesPaginateResponse extends IBasePaginationResponse<IPackageData> {}
export interface ISubscribePackageResponse extends IApiResponse<ISubscriptionData> {}
export interface IFindOneSubscriptionByIdResponse extends IApiResponse<ISubscriptionData> {}
export interface IFindAllSubscriptionsPaginateResponse extends IBasePaginationResponse<ISubscriptionData> {}
export interface ICancelSubscriptionResponse extends IApiResponse<ISubscriptionData> {}

// Aliases for backwards compatibility
export type IPackageSuccessResponse = IFindOnePackageByIdResponse
export type IPackagePaginatedResponse = IFindAllPackagesPaginateResponse
export type ISubscriptionSuccessResponse = IFindOneSubscriptionByIdResponse
export type ISubscriptionPaginatedResponse = IFindAllSubscriptionsPaginateResponse
