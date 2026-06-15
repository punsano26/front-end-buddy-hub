import type { IApiResponse } from './Response.model'

export interface IFindWalletBalanceData {
  userId: number
  balance: number
}

export type IFindWalletBalanceResponse = IApiResponse<IFindWalletBalanceData>
