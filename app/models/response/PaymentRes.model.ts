import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { PaymentMethodEnum } from '../enums/Paymen.enum'

export interface IBuyCoinPackageWithStripeData {
  id: number
  userId: number
  coinPackageId: number
  coinPackageVersionId: number
  amount: number
  currency: string
  status: FriendRequestStatusEnum
  paymentMethod: PaymentMethodEnum
  ref1: string
  authorizeUri: string
  expiresAt: string | null
  paidAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface IBuyCoinPackageWithStripeResponse extends IBuyCoinPackageWithStripeData {}
