import HttpRequest from '../HttpRequest'
import type { IBuyCoinPackagePayload } from '~/models/request/PaymentReq.model'
import type {
  IBuyCoinPackageResponse,
  IValidOrderResponse,
  IVerifySlipResponse
} from '~/models/response/PaymentRes.model'
import type { IApiResponse } from '~/models/response/Response.model'

export interface IPaymentProvider {
  buyCoinPackage (payload: IBuyCoinPackagePayload): Promise<IBuyCoinPackageResponse>
  getValidOrder (): Promise<IValidOrderResponse>
  getLatestOrder (): Promise<IApiResponse<any>>
  getOrderById (id: number): Promise<IApiResponse<any>>
  verifySlip (file: File): Promise<IVerifySlipResponse>
  refreshOrder (): Promise<IBuyCoinPackageResponse>
  cancelOrder (id: number): Promise<IApiResponse<any>>
}

class PaymentProvider extends HttpRequest implements IPaymentProvider {
  private urlPrefix: string = '/payments'

  public async buyCoinPackage (payload: IBuyCoinPackagePayload): Promise<IBuyCoinPackageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/coin-package`, payload)
    return response
  }

  public async getValidOrder (): Promise<IValidOrderResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/orders/valid`)
    return response
  }

  public async getLatestOrder (): Promise<IApiResponse<any>> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/orders/latest`)
    return response
  }

  public async getOrderById (id: number): Promise<IApiResponse<any>> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/orders/${id}`)
    return response
  }

  public async verifySlip (file: File): Promise<IVerifySlipResponse> {
    this.setUserAuthHeader()
    const formData = new FormData()
    formData.append('image', file)
    const response = await this.post(`${this.urlPrefix}/slip`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }

  public async refreshOrder (): Promise<IBuyCoinPackageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/orders/refresh`, {})
    return response
  }

  public async cancelOrder (id: number): Promise<IApiResponse<any>> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/orders/${id}/cancel`, {})
    return response
  }
}

export default PaymentProvider
