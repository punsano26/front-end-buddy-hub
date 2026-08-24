import HttpRequest from '../HttpRequest'
import type {
  IFindAllPackagesPaginateQuery,
  IListPackagesQuery
} from '~/models/request/PackageReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  IFindAllPackagesPaginateResponse,
  IFindOnePackageByIdResponse,
  IPackagePaginatedResponse,
  IPackageSuccessResponse,
  ISubscribePackageResponse
} from '~/models/response/PackageRes.model'

export interface IPackageProvider {
  findAllPackagesPaginate (query?: IFindAllPackagesPaginateQuery): Promise<IFindAllPackagesPaginateResponse>
  findOnePackageById (id: TBaseParamsId): Promise<IFindOnePackageByIdResponse>
  subscribePackage (id: TBaseParamsId): Promise<ISubscribePackageResponse>

  // Aliases for backwards compatibility
  listPackages (query?: IListPackagesQuery): Promise<IPackagePaginatedResponse>
  getPackageById (id: TBaseParamsId): Promise<IPackageSuccessResponse>
}

class PackageProvider extends HttpRequest implements IPackageProvider {
  private urlPrefix: string = '/packages'

  public async findAllPackagesPaginate (query?: IFindAllPackagesPaginateQuery): Promise<IFindAllPackagesPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async findOnePackageById (id: TBaseParamsId): Promise<IFindOnePackageByIdResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async subscribePackage (id: TBaseParamsId): Promise<ISubscribePackageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/${id}/subscribe`, {})
    return response
  }

  // Aliases for backwards compatibility
  public listPackages (query?: IListPackagesQuery): Promise<IPackagePaginatedResponse> {
    return this.findAllPackagesPaginate(query)
  }

  public getPackageById (id: TBaseParamsId): Promise<IPackageSuccessResponse> {
    return this.findOnePackageById(id)
  }
}

export default PackageProvider
