import type { IBasePaginationRequest } from './Request.model'

export interface IFindSubscriptionFilters {
  status?: string
}

export interface IFindAllSubscriptionsPaginateQuery extends IBasePaginationRequest, IFindSubscriptionFilters {}
export type IListSubscriptionsQuery = IFindAllSubscriptionsPaginateQuery
