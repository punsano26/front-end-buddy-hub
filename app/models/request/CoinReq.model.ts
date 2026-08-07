import type { IBasePaginationRequest } from './Request.model'

export interface IFindCoinFilters {}

export interface IFindAllCoinsPaginateQuery extends IBasePaginationRequest, IFindCoinFilters {}
