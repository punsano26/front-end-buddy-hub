import type { IPaginationRequest } from '../Global.model'

export type TBaseParamsId = number | string | string[] | undefined
export interface IBasePaginationRequest extends IPaginationRequest {
  search?: string
  sortByGender?: string
  maxAge?: number
  minAge?: number
}
