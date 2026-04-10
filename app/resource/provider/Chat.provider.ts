import HttpRequest from '../HttpRequest'
import type { ICreateMessagePayload, IFindOneMessagePaginateQuery } from '~/models/request/ChatReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ICreateMessageResponse, IFindOneMessagePaginateResponse } from '~/models/response/ChatRes.model'

export interface IChatProvider {
  createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse>
  findOneMessagePaginate (id: TBaseParamsId, query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse>
}

class ChatProvider extends HttpRequest implements IChatProvider {
  private urlPrefix: string = '/chat'

  public async createMessage (payload: ICreateMessagePayload): Promise<ICreateMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/send`, payload)
    return response
  }

  public async findOneMessagePaginate (id: TBaseParamsId, query: IFindOneMessagePaginateQuery): Promise<IFindOneMessagePaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/messages/${id}`, query)
    return response
  }
}

export default ChatProvider
