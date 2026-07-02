import type { IBasePaginationRequest } from './Request.model'

export interface ICreateAReviewPayload {
  hireSessionId: number
  reviewedUserId: number
  rating: number
  comment: string
}

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

export interface IFindAllConversationSessionsFilters {

}

export interface IFindOneSessionsMessagesFilters {

}

export interface IFindAllRentPostsPaginateQuery extends IBasePaginationRequest, IFindRentPostsFilters {}
export interface IFindAllConversationSessionsPaginateQuery extends IBasePaginationRequest, IFindAllConversationSessionsFilters {}
export interface IFindOneSessionsMessagesPaginateQuery extends IBasePaginationRequest, IFindOneSessionsMessagesFilters {}

export interface IExtendSessionPayload {
  additionalMinutes: number
}
