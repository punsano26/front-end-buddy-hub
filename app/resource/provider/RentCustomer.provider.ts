import HttpRequest from '../HttpRequest'
import type { IRentAPostPayload } from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IRentAPostResponse } from '~/models/response/RentRes.model'

export interface IRentCustomerProvider {
  rentAPost(payload: IRentAPostPayload): Promise<IRentAPostResponse>
  acceptAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse>
  rejectAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse>
}

class RentCustomerProvider extends HttpRequest implements IRentCustomerProvider {
  private urlPrefix: string = '/hire'

  public async rentAPost (payload: IRentAPostPayload): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async acceptAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/accept`, {})
    return response
  }

  public async rejectAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/reject`, {})
    return response
  }
}

export default RentCustomerProvider
