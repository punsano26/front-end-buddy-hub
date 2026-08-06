import type { PaymentMethodEnum, PaymentStatusEnum } from '../enums/Paymen.enum'
import type { IApiResponse } from './Response.model'

export interface IBuyCoinPackageWithStripeData {
  orderId: number
  ref1: string
  amount: number
  currency: string
  paymentMethod: PaymentMethodEnum | null
  clientSecret: string | null
  paymentIntentId: string | null
  authorizeUri: string | null
  expiresAt: string | null
  status: PaymentStatusEnum
}

export interface IBuyCoinPackageWithStripeResponse extends IApiResponse<IBuyCoinPackageWithStripeData> {}
