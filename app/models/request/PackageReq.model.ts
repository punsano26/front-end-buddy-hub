import type { IBasePaginationRequest } from './Request.model'

export interface IFindPackageFilters {}
export interface IFindAllPackagesPaginateQuery extends IBasePaginationRequest, IFindPackageFilters {}
export type IListPackagesQuery = IFindAllPackagesPaginateQuery

export interface IFindSubscriptionFilters {
  status?: string
}
export interface IFindAllSubscriptionsPaginateQuery extends IBasePaginationRequest, IFindSubscriptionFilters {}
export type IListSubscriptionsQuery = IFindAllSubscriptionsPaginateQuery
