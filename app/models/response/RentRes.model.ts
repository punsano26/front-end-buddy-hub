import type { IApiResponse, IBasePaginationResponse } from './Response.model'

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
  tags: IFindAllRentTagsData[]
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

export type ICreateTagsRentResponse = IApiResponse<ICreateTagsRentData[]>
export type IFindAllRentTagsResponse = IApiResponse<IFindAllRentTagsData[]>
export type IFindAllRentCategoriesResponse = IApiResponse<IFindAllRentCategoriesData[]>
export type IFindOneRentPostResponse = IApiResponse<IFindAllRentPostList>
export type ICreateRentPostResponse = IApiResponse<IFindAllRentPostList>
export interface IFindAllRentPostsPaginateResponse extends IBasePaginationResponse<IFindAllRentPostList> {}
