import type { IBasePaginationRequest } from './Request.model'

export interface IRentAPostPayload {
  hirePostId: number
  durationMinutes: number
}

export interface ICreateRentPostPayload {
  categoryId: number
  tagline: string
  description: string
  coinRatePerMinute: number
  maxDurationMinutes: number
  tagNames: string[]
}

export interface ICreateTagsRentPayload {
  name: string
}

export interface IUpdateRentPostPayload {
  categoryId?: number
  tagline?: string
  description?: string
  coinRatePerMinute?: number
  maxDurationMinutes?: number
  isActive?: boolean
  tagNames?: string[]
}

export interface IFindRentPostsFilters {

}

export interface IFindAllRentPostsPaginateQuery extends IBasePaginationRequest, IFindRentPostsFilters {}
