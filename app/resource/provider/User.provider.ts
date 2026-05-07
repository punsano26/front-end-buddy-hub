import HttpRequest from '../HttpRequest'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllUsersPaginateQuery, IUpdateUserPayload } from '~/models/request/UserReq.model'
import type {
  IFindAllUsersPaginateResponse,
  IFindOneCurrentUserResponse,
  IFindOneUserDetailResponse
} from '~/models/response/UserRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IUserProvider {
  findOneCurrentUser (): Promise<IFindOneCurrentUserResponse>
  findAllUsersPaginate (query: IFindAllUsersPaginateQuery): Promise<IFindAllUsersPaginateResponse>
  findOneUserById (id: TBaseParamsId): Promise<IFindOneUserDetailResponse>
  updateUser (payload: IUpdateUserPayload): Promise<IFindOneCurrentUserResponse>
  removeProfileImage (): Promise<IMessageResponse>
  removeBannerImage (): Promise<IMessageResponse>
  toggleAdminRole (id: TBaseParamsId): Promise<IFindOneCurrentUserResponse>
}

class UserProvider extends HttpRequest implements IUserProvider {
  private urlPrefix: string = '/users'

  public async findOneCurrentUser (): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/me`)
    return response
  }

  public async findAllUsersPaginate (query: IFindAllUsersPaginateQuery): Promise<IFindAllUsersPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async findOneUserById (id: TBaseParamsId): Promise<IFindOneUserDetailResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async updateUser (payload: IUpdateUserPayload): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/me`, payload)
    return response
  }

  public async removeProfileImage (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/me/profile-image`)
    return response
  }

  public async removeBannerImage (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/me/banner-image`)
    return response
  }

  public async toggleAdminRole (id: TBaseParamsId): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}/role`, {})
    return response
  }
}

export default UserProvider
