import HttpRequest from '../HttpRequest'
import type { IFriendsIdRequest } from '~/models/request/Request.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IFriendProvider {
  sendAFriendRequest (payload: IFriendsIdRequest): Promise<IMessageResponse>

}

class FriendProvider extends HttpRequest implements IFriendProvider {
  private urlPrefix: string = '/friends'

  public async sendAFriendRequest (payload: IFriendsIdRequest): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/request`, payload)
    return response
  }
}

export default FriendProvider
