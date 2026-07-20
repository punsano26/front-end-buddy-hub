import type { IApiResponse } from './Response.model'

export interface IFindWalletBalanceData {
  userId: number
  balance: number
}

export interface ISendCoinsToAnotherUserData {
  amount: number
  description: 'string'
  senderUserId: number
  senderBalance: number
  receiverId: number
  receiverBalance: number
}

export type IFindWalletBalanceResponse = IApiResponse<IFindWalletBalanceData>
export interface ISendCoinsToAnotherUserResponse extends IApiResponse<ISendCoinsToAnotherUserData> {}
