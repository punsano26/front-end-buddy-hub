import HttpRequest from '../HttpRequest'
import type { IBuyCoinPackageWithStripePayload } from '~/models/request/PaymentReq.model'
import type { IBuyCoinPackageWithStripeResponse } from '~/models/response/PaymentRes.model'

export interface IPaymentProvider {
  BuyCoinPackageWithStripe (payload: IBuyCoinPackageWithStripePayload): Promise<IBuyCoinPackageWithStripeResponse>
}

class PaymentProvider extends HttpRequest implements IPaymentProvider {
  private urlPrefix: string = '/payments'

  public async BuyCoinPackageWithStripe (payload: IBuyCoinPackageWithStripePayload): Promise<IBuyCoinPackageWithStripeResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/stripe`, payload)
    return response
  }
}

export default PaymentProvider
