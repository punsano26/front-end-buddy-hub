import HttpRequest from '../HttpRequest'
import type { IFindAllSubscriptionsPaginateQuery, IListSubscriptionsQuery } from '~/models/request/SubscriptionReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  ICancelSubscriptionResponse,
  IFindAllSubscriptionsPaginateResponse,
  IFindOneSubscriptionByIdResponse,
  ISubscriptionPaginatedResponse,
  ISubscriptionSuccessResponse
} from '~/models/response/SubscriptionRes.model'

export interface ISubscriptionProvider {
  findAllMySubscriptionsPaginate (query?: IFindAllSubscriptionsPaginateQuery): Promise<IFindAllSubscriptionsPaginateResponse>
  findOneMySubscriptionById (id: TBaseParamsId): Promise<IFindOneSubscriptionByIdResponse>
  cancelSubscription (id: TBaseParamsId): Promise<ICancelSubscriptionResponse>

  // Aliases for backwards compatibility
  listMySubscriptions (query?: IListSubscriptionsQuery): Promise<ISubscriptionPaginatedResponse>
  getMySubscriptionById (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse>
}

class SubscriptionProvider extends HttpRequest implements ISubscriptionProvider {
  private urlPrefix: string = '/subscriptions'

  public async findAllMySubscriptionsPaginate (query?: IFindAllSubscriptionsPaginateQuery): Promise<IFindAllSubscriptionsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async findOneMySubscriptionById (id: TBaseParamsId): Promise<IFindOneSubscriptionByIdResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async cancelSubscription (id: TBaseParamsId): Promise<ICancelSubscriptionResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/${id}/cancel`, {})
    return response
  }

  // Aliases for backwards compatibility
  public listMySubscriptions (query?: IListSubscriptionsQuery): Promise<ISubscriptionPaginatedResponse> {
    return this.findAllMySubscriptionsPaginate(query)
  }

  public getMySubscriptionById (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse> {
    return this.findOneMySubscriptionById(id)
  }
}

export default SubscriptionProvider
