import type { IBasePaginationRequest } from './Request.model'

export interface IFindFriendFilters {}

export interface IFindAllRequestPaginateQuery extends IBasePaginationRequest, IFindFriendFilters {}

export interface IFindAllFriendPaginateQuery extends IBasePaginationRequest, IFindFriendFilters {}
