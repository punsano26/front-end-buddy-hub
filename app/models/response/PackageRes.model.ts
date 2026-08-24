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

export interface IPackageSuccessResponse extends IApiResponse<IPackageData> {}
export interface IPackagePaginatedResponse extends IBasePaginationResponse<IPackageData> {}
export interface ISubscriptionSuccessResponse extends IApiResponse<ISubscriptionData> {}
export interface ISubscriptionPaginatedResponse extends IBasePaginationResponse<ISubscriptionData> {}
