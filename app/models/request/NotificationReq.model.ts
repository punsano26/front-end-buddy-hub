import type { IBasePaginationRequest } from './Request.model'

export interface IFindNotificationFilters {}

export interface IFindAllNotificationPaginateQuery extends IBasePaginationRequest, IFindNotificationFilters {}
