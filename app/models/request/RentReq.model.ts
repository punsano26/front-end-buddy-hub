import type { IBasePaginationRequest } from './Request.model'

export interface IFindRentPostsFilters {

}

export interface IFindAllRentPostsPaginateQuery extends IBasePaginationRequest, IFindRentPostsFilters {}
