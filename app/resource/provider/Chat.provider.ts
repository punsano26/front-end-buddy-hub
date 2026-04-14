import HttpRequest from '../HttpRequest'
import type { ICreateMessagePayload, IFindOneMessagePaginateQuery, IUpdateMessagePayload } from '~/models/request/ChatReq.model'
import type { IFriendsIdRequest, TBaseParamsId } from '~/models/request/Request.model'
import type { ICreateMessageResponse, IFindOneMessagePaginateResponse } from '~/models/response/ChatRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IChatProvider {
  createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse>
  findOneMessagePaginate (query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse>
  updateMessage (payload: IUpdateMessagePayload): Promise<IMessageResponse>
  deleteMessage (id: TBaseParamsId): Promise<IMessageResponse>
  markMessagesAsRead (payload: IFriendsIdRequest): Promise<IMessageResponse>
}

class ChatProvider extends HttpRequest implements IChatProvider {
  private urlPrefix: string = '/chat'

  public async createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/send`, payload)
    return response
  }

  public async findOneMessagePaginate (query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/messages`, query)
    return response
  }

  public async updateMessage (payload: IUpdateMessagePayload): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/edit`, payload)
    return response
  }

  public async deleteMessage (id: TBaseParamsId): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/delete/${id}`, {})
    return response
  }

  public async markMessagesAsRead (payload: IFriendsIdRequest): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/read`, payload)
    return response
  }
}

export default ChatProvider
