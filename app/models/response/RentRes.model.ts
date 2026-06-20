import type { rentStatusEnum } from '../enums/Rent.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IRentAPostData {
  id: number
  customerId: number
  hirePostId: number
  coinTransactionId: number
  coinPaid: number
  durationMinutes: number
  status: rentStatusEnum
  acceptedAt: string | null
  startedAt: string | null
  expiresAt: string | null
  endedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  customer: ICustomer
  provider: IProvider
  rating: IRating
  hirePost: IHirePost
}

export interface ICustomer {
  id: number
  username: string
  nickname: string
  profileImg: string
  isOnline: boolean
}

export interface IHirePost {
  id: number
  tagline: string
}

export interface IFindAllRentTagsData {
  id: number
  name: string
  isActive: boolean
}

export interface IFindAllRentCategoriesData {
  id: number
  name: string
  description: string
  isActive: boolean
}

export interface IFindAllRentPostList {
  id: number
  userId: number
  categoryId: number
  tagline: string
  description: string
  coinRatePerMinute: number
  maxDurationMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: IFindAllRentCategoriesData
  provider: IProvider
  tags: string[]
  isOnline: boolean
}

export interface IProvider {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  isOnline: boolean
  rating: IRating
}

export interface IRating {
  averageRating: number | null
  reviewCount: number
}

export interface ICreateTagsRentData {
  id: number
  name: string
  isActive: boolean
}

export interface ICheckRentPostAlreadyExistsData {
  hasPost: boolean
}

export type ICheckRentPostAlreadyExistsResponse = IApiResponse<ICheckRentPostAlreadyExistsData>
export type ICreateTagsRentResponse = IApiResponse<ICreateTagsRentData[]>
export type IFindAllRentTagsResponse = IApiResponse<IFindAllRentTagsData[]>
export type IFindAllRentCategoriesResponse = IApiResponse<IFindAllRentCategoriesData[]>
export type IFindOneRentPostResponse = IApiResponse<IFindAllRentPostList>
export type ICreateRentPostResponse = IApiResponse<IFindAllRentPostList>
export interface IFindAllRentPostsPaginateResponse extends IBasePaginationResponse<IFindAllRentPostList> {}

export type IRentAPostResponse = IApiResponse<IRentAPostData>
