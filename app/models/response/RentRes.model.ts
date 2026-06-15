import type { IApiResponse } from './Response.model'

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

export type IFindAllRentTagsResponse = IApiResponse<IFindAllRentTagsData[]>
export type IFindAllRentCategoriesResponse = IApiResponse<IFindAllRentCategoriesData[]>
