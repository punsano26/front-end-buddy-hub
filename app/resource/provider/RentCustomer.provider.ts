import HttpRequest from '../HttpRequest'
import type { IRentAPostPayload } from '~/models/request/RentReq.model'
import type { IRentAPostResponse } from '~/models/response/RentRes.model'

export interface IRentCustomerProvider {
  rentAPost(payload: IRentAPostPayload): Promise<IRentAPostResponse>
}

class RentCustomerProvider extends HttpRequest implements IRentCustomerProvider {
  private urlPrefix: string = '/hire'

  public async rentAPost (payload: IRentAPostPayload): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }
}

export default RentCustomerProvider
