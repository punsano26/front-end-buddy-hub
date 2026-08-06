import type { PaymentMethodEnum, PaymentStatusEnum } from '../enums/Paymen.enum'

export interface IBuyCoinPackageWithStripeData {
  id: number
  userId: number
  coinPackageId: number
  coinPackageVersionId: number
  amount: number
  currency: string
  status: PaymentStatusEnum
  paymentMethod: PaymentMethodEnum
  ref1: string
  clientSecret: string
  paymentIntentId: string
  authorizeUri: string
  expiresAt: string | null
  paidAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface IBuyCoinPackageWithStripeResponse extends IBuyCoinPackageWithStripeData {}
