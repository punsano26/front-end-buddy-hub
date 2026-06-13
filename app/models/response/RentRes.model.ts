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

export type IFindAllRentTagsResponse = IFindAllRentTagsData
export type IFindAllRentCategoriesResponse = IFindAllRentCategoriesData
