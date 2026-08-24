import type { IApiResponse } from './Response.model'

export interface IBuyCoinPackageData {
  orderId: number
  ref1: string
  amount: number
  currency: string
  qrPayload: string
  qrImageBase64: string
  qrExpiresAt: string
  qrRemainingSeconds: number
  expiresAt: string
  orderRemainingSeconds: number
  status: string
}

export interface IBuyCoinPackageResponse extends IApiResponse<IBuyCoinPackageData> {}

export interface IValidOrderData {
  id: number
  userId: number
  coinPackageId: number
  coinPackageVersionId: number
  amount: number
  currency: string
  ref1: string
  qrPayload: string
  qrExpiresAt: string
  expiresAt: string
  status: string
  qrImageBase64: string
  qrRemainingSeconds: number
  orderRemainingSeconds: number
}

export interface IValidOrderResponse extends IApiResponse<IValidOrderData> {}

export interface IVerifySlipData {
  valid: boolean
  amount: number | null
  senderName: string | null
  senderBankCode: string | null
  receiverName: string | null
  receiverBankCode: string | null
  transDate: string | null
  transRef: string | null
  slipImageKey: string | null
}

export interface IVerifySlipResponse extends IApiResponse<IVerifySlipData> {}
