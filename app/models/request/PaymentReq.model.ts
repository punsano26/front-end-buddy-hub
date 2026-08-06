import type { PaymentMethodEnum } from '../enums/Paymen.enum'

export interface IBuyCoinPackageWithStripePayload {
  coinPackageId: number
  paymentMethod: PaymentMethodEnum
}
