import HttpRequest from '../HttpRequest'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllUsersPaginateQuery, IUpdateUserPayload } from '~/models/request/UserReq.model'
import type { IFindAllUsersPaginateResponse, IFindOneCurrentUserResponse } from '~/models/response/UserRes.model'

export interface IUserProvider {
  findOneCurrentUser (): Promise<IFindOneCurrentUserResponse>
  findAllUsersPaginate (query: IFindAllUsersPaginateQuery): Promise<IFindAllUsersPaginateResponse>
  findOneUserById (id: TBaseParamsId): Promise<IFindOneCurrentUserResponse>
  updateUser (payload: IUpdateUserPayload): Promise<IFindOneCurrentUserResponse>
}

class UserProvider extends HttpRequest implements IUserProvider {
  private urlPrefix: string = '/users'

  public async findOneCurrentUser (): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/myInfo`)
    return response
  }

  public async findAllUsersPaginate (query: IFindAllUsersPaginateQuery): Promise<IFindAllUsersPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async findOneUserById (id: TBaseParamsId): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async updateUser (payload: IUpdateUserPayload): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/update`, payload)
    return response
  }
}

export default UserProvider
