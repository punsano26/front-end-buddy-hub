import type { IBasePaginationRequest } from './Request.model'

export interface ICreateRentPostPayload {
  categoryId: number
  tagline: string
  description: string
  coinRatePerMinute: number
  maxDurationMinutes: number
  tagNames: string[]
}

export interface IFindRentPostsFilters {

}

export interface IFindAllRentPostsPaginateQuery extends IBasePaginationRequest, IFindRentPostsFilters {}
