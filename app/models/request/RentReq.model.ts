import type { IBasePaginationRequest } from './Request.model'

export interface ICreateRentPostPayload {
  categoryId: number
  tagLine: string
  description: string
  coinRatePerMinute: number
  maxDurationInMinutes: number
  tagNames: string[]
}

export interface IFindRentPostsFilters {

}

export interface IFindAllRentPostsPaginateQuery extends IBasePaginationRequest, IFindRentPostsFilters {}
