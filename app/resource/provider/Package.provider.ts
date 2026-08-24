import HttpRequest from '../HttpRequest'
import type { IListPackagesQuery, IListSubscriptionsQuery } from '~/models/request/PackageReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  IPackagePaginatedResponse,
  IPackageSuccessResponse,
  ISubscriptionPaginatedResponse,
  ISubscriptionSuccessResponse
} from '~/models/response/PackageRes.model'

export interface IPackageProvider {
  listPackages (query?: IListPackagesQuery): Promise<IPackagePaginatedResponse>
  getPackageById (id: TBaseParamsId): Promise<IPackageSuccessResponse>
  subscribePackage (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse>
  listMySubscriptions (query?: IListSubscriptionsQuery): Promise<ISubscriptionPaginatedResponse>
  getMySubscriptionById (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse>
  cancelSubscription (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse>
}

class PackageProvider extends HttpRequest implements IPackageProvider {
  public async listPackages (query?: IListPackagesQuery): Promise<IPackagePaginatedResponse> {
    this.setUserAuthHeader()
    const response = await this.get('/packages', query)
    return response
  }

  public async getPackageById (id: TBaseParamsId): Promise<IPackageSuccessResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`/packages/${id}`)
    return response
  }

  public async subscribePackage (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`/packages/${id}/subscribe`, {})
    return response
  }

  public async listMySubscriptions (query?: IListSubscriptionsQuery): Promise<ISubscriptionPaginatedResponse> {
    this.setUserAuthHeader()
    const response = await this.get('/subscriptions', query)
    return response
  }

  public async getMySubscriptionById (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`/subscriptions/${id}`)
    return response
  }

  public async cancelSubscription (id: TBaseParamsId): Promise<ISubscriptionSuccessResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`/subscriptions/${id}/cancel`, {})
    return response
  }
}

export default PackageProvider
