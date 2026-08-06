import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface ICoinList {
  id: number
  name: string
  description: string
  coinAmount: number
  bonusCoin: number
  price: number
  currency: string
  discount: number
  iconUrl: null
  isBestValue: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IFindOneCoinByIdResponse extends IApiResponse<ICoinList> {}
export interface IFindAllCoinsPaginateResponse extends IBasePaginationResponse<ICoinList> {}
