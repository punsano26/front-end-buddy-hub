import HttpRequest from '../HttpRequest'
import type { IFindAllRequestPaginateQuery } from '~/models/request/FriendReq.model'
import type { IFriendsIdRequest, TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllRequestPaginateResponse, ISendAFriendRequestResponse } from '~/models/response/FriendRes.model'

export interface IFriendProvider {
  sendAFriendRequest (payload: IFriendsIdRequest): Promise<ISendAFriendRequestResponse>
  findAllRequestPaginate (query: IFindAllRequestPaginateQuery): Promise<IFindAllRequestPaginateResponse>
  acceptFriendRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse>
  rejectFriendRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse>
}

class FriendProvider extends HttpRequest implements IFriendProvider {
  private urlPrefix: string = '/friends'

  public async sendAFriendRequest (payload: IFriendsIdRequest): Promise<ISendAFriendRequestResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/request`, payload)
    return response
  }

  public async findAllRequestPaginate (query: IFindAllRequestPaginateQuery): Promise<IFindAllRequestPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/request/list`, query)
    return response
  }

  public async acceptFriendRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/accept/${id}`, {})
    return response
  }

  public async rejectFriendRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/reject/${id}`, {})
    return response
  }
}

export default FriendProvider
