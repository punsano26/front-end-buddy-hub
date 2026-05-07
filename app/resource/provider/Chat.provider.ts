import HttpRequest from '../HttpRequest'
import type {
  ICreateMessagePayload,
  IFindAllConversationsPaginateQuery,
  IFindOneMessagePaginateQuery,
  IUpdateMessagePayload
} from '~/models/request/ChatReq.model'
import type { IFriendsIdRequest, TBaseParamsId } from '~/models/request/Request.model'
import type {
  ICreateMessageResponse,
  IDeleteMessageResponse,
  IFindAllConversationsPaginateResponse,
  IFindAllUnreadMessagesResponse,
  IFindOneMessagePaginateResponse,
  IGetMessageLimitResponse,
  IMarkMessagesAsReadResponse,
  IUpdateMessageResponse
} from '~/models/response/ChatRes.model'

export interface IChatProvider {
  createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse>
  findOneMessagePaginate (query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse>
  findAllConversationsPaginate (query: IFindAllConversationsPaginateQuery): Promise<IFindAllConversationsPaginateResponse>
  findAllUnreadMessages (id: TBaseParamsId): Promise<IFindAllUnreadMessagesResponse>
  getMessageLimit (id: TBaseParamsId): Promise<IGetMessageLimitResponse>
  updateMessage (payload: IUpdateMessagePayload): Promise<IUpdateMessageResponse>
  deleteMessage (id: TBaseParamsId): Promise<IDeleteMessageResponse>
  markMessagesAsRead (payload: IFriendsIdRequest): Promise<IMarkMessagesAsReadResponse>
}

class ChatProvider extends HttpRequest implements IChatProvider {
  private urlPrefix: string = '/conversations'

  public async createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse> {
    this.setUserAuthHeader()
    const { receiverId, ...body } = payload
    const response = await this.post(`${this.urlPrefix}/${receiverId}/messages`, body)
    return response
  }

  public async findOneMessagePaginate (query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse> {
    this.setUserAuthHeader()
    const { partnerId, ...params } = query
    const response = await this.get(`${this.urlPrefix}/${partnerId}/messages`, params)
    return response
  }

  public async updateMessage (payload: IUpdateMessagePayload): Promise<IUpdateMessageResponse> {
    this.setUserAuthHeader()
    const { messageId, ...body } = payload
    const response = await this.patch(`${this.urlPrefix}/messages/${messageId}`, body)
    return response
  }

  public async deleteMessage (id: TBaseParamsId): Promise<IDeleteMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/messages/${id}`)
    return response
  }

  public async markMessagesAsRead (payload: IFriendsIdRequest): Promise<IMarkMessagesAsReadResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${payload.friendId}/messages/read`, {})
    return response
  }

  public async findAllConversationsPaginate (query: IFindAllConversationsPaginateQuery): Promise<IFindAllConversationsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async findAllUnreadMessages (id: TBaseParamsId): Promise<IFindAllUnreadMessagesResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}/unread-count`)
    return response
  }

  public async getMessageLimit (id: TBaseParamsId): Promise<IGetMessageLimitResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}/message-limit`)
    return response
  }
}

export default ChatProvider
