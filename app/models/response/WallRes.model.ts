import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IFindWalletBalanceData {
  userId: number
  balance: number
}

export interface ISendCoinsToAnotherUserData {
  amount: number
  description: string
  senderUserId: number
  senderBalance: number
  receiverId: number
  receiverBalance: number
}

export interface ICoinTransaction {
  id: number
  walletId: number
  transactionType: string
  referenceType: string | null
  referenceId: number | null
  amount: number
  balanceAfter: number
  description: string | null
  createdAt: string
}

export type IFindWalletBalanceResponse = IApiResponse<IFindWalletBalanceData>
export interface ISendCoinsToAnotherUserResponse extends IApiResponse<ISendCoinsToAnotherUserData> {}
export type IWalletTransactionsResponse = IBasePaginationResponse<ICoinTransaction>
