import HttpRequest from '../HttpRequest'
import type { ICreateMessagePayload, IUpdateMessagePayload } from '~/models/request/ChatReq.model'
import type { IFindAllConversationSessionsPaginateQuery, IFindOneSessionsMessagesPaginateQuery, IRentAPostPayload, IExtendSessionPayload } from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IMessageReadStatus } from '~/models/response/ChatRes.model'
import type {
  ICheckIfSessionIsExpiredResponse,
  ICreateSessionMessageResponse,
  IFindAllConversationSessionsPaginateResponse,
  IFindOneSessionsMessagesPaginateResponse,
  IFindRealtimeSessionMessagesResponse,
  IRentAPostResponse
} from '~/models/response/RentRes.model'

export interface IRentCustomerProvider {
  rentAPost(payload: IRentAPostPayload): Promise<IRentAPostResponse>
  acceptAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse>
  rejectAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse>
  findAllConversationSessionsPaginate (query: IFindAllConversationSessionsPaginateQuery): Promise<IFindAllConversationSessionsPaginateResponse>
  findOneConversationSessionById (id: TBaseParamsId): Promise<IRentAPostResponse>
  findOneSessionMessagesPaginate (query: IFindOneSessionsMessagesPaginateQuery, id: TBaseParamsId): Promise<IFindOneSessionsMessagesPaginateResponse>
  createSessionMessage (payload: ICreateMessagePayload, id: TBaseParamsId): Promise<ICreateSessionMessageResponse>
  updateSessionMessage (payload: IUpdateMessagePayload, messageId: TBaseParamsId, sessionId: TBaseParamsId): Promise<ICreateSessionMessageResponse>
  deleteSessionMessage (messageId: TBaseParamsId, sessionId: TBaseParamsId): Promise<ICreateSessionMessageResponse>
  markMessagesAsRead (id: TBaseParamsId): Promise<IMessageReadStatus>
  requestSessionCompletion (id: TBaseParamsId): Promise<IRentAPostResponse>
  confirmSessionCompletion (id: TBaseParamsId): Promise<IRentAPostResponse>
  findRealtimeSessionMessages (id: TBaseParamsId): Promise<IFindRealtimeSessionMessagesResponse>
  checkIfSessionIsExpired (id: TBaseParamsId): Promise<ICheckIfSessionIsExpiredResponse>
  extendSession (id: TBaseParamsId, payload: IExtendSessionPayload): Promise<IRentAPostResponse>
}

class RentCustomerProvider extends HttpRequest implements IRentCustomerProvider {
  private urlPrefix: string = '/hire'

  public async rentAPost (payload: IRentAPostPayload): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async acceptAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/accept`, {})
    return response
  }

  public async rejectAHireRequest (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/reject`, {})
    return response
  }

  public async findAllConversationSessionsPaginate (query: IFindAllConversationSessionsPaginateQuery): Promise<IFindAllConversationSessionsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/sessions`, query)
    return response
  }

  public async findOneConversationSessionById (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/sessions/${id}`)
    return response
  }

  public async findOneSessionMessagesPaginate (query: IFindOneSessionsMessagesPaginateQuery, id: TBaseParamsId): Promise<IFindOneSessionsMessagesPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/sessions/${id}/messages`, query)
    return response
  }

  public async createSessionMessage (payload: ICreateMessagePayload, id: TBaseParamsId): Promise<ICreateSessionMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/messages`, payload)
    return response
  }

  public async updateSessionMessage (payload: IUpdateMessagePayload, messageId: TBaseParamsId, sessionId: TBaseParamsId): Promise<ICreateSessionMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/sessions/${sessionId}/messages/${messageId}`, payload)
    return response
  }

  public async deleteSessionMessage (messageId: TBaseParamsId, sessionId: TBaseParamsId): Promise<ICreateSessionMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/sessions/${sessionId}/messages/${messageId}`)
    return response
  }

  public async markMessagesAsRead (id: TBaseParamsId): Promise<IMessageReadStatus> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/sessions/${id}/messages/read`, {})
    return response
  }

  // (either side)
  public async requestSessionCompletion (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/request-complete`, {})
    return response
  }

  // (the other side)
  public async confirmSessionCompletion (id: TBaseParamsId): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/confirm-complete`, {})
    return response
  }

  findRealtimeSessionMessages (id: TBaseParamsId): Promise<any> {
    this.setUserAuthHeader()
    const response = this.get(`${this.urlPrefix}/sessions/${id}/timer`)
    return response
  }

  checkIfSessionIsExpired (id: TBaseParamsId): Promise<any> {
    this.setUserAuthHeader()
    const response = this.get(`${this.urlPrefix}/sessions/${id}/expiry-check`)
    return response
  }

  public async extendSession (id: TBaseParamsId, payload: IExtendSessionPayload): Promise<IRentAPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/extend`, payload)
    return response
  }
}

export default RentCustomerProvider
