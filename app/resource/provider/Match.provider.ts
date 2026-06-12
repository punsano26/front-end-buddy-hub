import HttpRequest from '../HttpRequest'
import type { IJoinTheRandomMatchQueuePayload, ISendASessionMessagePayload } from '~/models/request/MatchReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ISendAFriendRequestResponse } from '~/models/response/FriendRes.model'
import type {
  IFindAllSessionMessagesResponse,
  IJoinTheRandomMatchQueueResponse,
  ILeaveTheMatchChatSessionEarlyResponse,
  ILeaveTheRandomMatchQueueResponse,
  ISendASessionMessageResponse
} from '~/models/response/MatchRes.model'

export interface IMatchProvider {
  JoinTheRandomMatchQueue (payload: IJoinTheRandomMatchQueuePayload): Promise<IJoinTheRandomMatchQueueResponse>
  LeaveTheRandomMatchQueue (): Promise<ILeaveTheRandomMatchQueueResponse>
  SendASessionMessage (id: TBaseParamsId, payload: ISendASessionMessagePayload): Promise<ISendASessionMessageResponse>
  findAllSessionMessages (id: TBaseParamsId): Promise<IFindAllSessionMessagesResponse>
  sendAFriendSessionRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse>
  leaveTheMatchChatSessionEarly (id: TBaseParamsId): Promise<ILeaveTheMatchChatSessionEarlyResponse>
}

class MatchProvider extends HttpRequest implements IMatchProvider {
  private urlPrefix: string = '/match'

  public async JoinTheRandomMatchQueue (payload: IJoinTheRandomMatchQueuePayload): Promise<IJoinTheRandomMatchQueueResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/queue`, payload)
    return response
  }

  public async LeaveTheRandomMatchQueue (): Promise<ILeaveTheRandomMatchQueueResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/queue`)
    return response
  }

  public async SendASessionMessage (id: TBaseParamsId, payload: ISendASessionMessagePayload): Promise<ISendASessionMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/messages`, payload)
    return response
  }

  public async findAllSessionMessages (id: TBaseParamsId): Promise<IFindAllSessionMessagesResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/sessions/${id}/messages`)
    return response
  }

  public async sendAFriendSessionRequest (id: TBaseParamsId): Promise<ISendAFriendRequestResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/sessions/${id}/friend-request`, {})
    return response
  }

  public async leaveTheMatchChatSessionEarly (id: TBaseParamsId): Promise<ILeaveTheMatchChatSessionEarlyResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/sessions/${id}`)
    return response
  }
}

export default MatchProvider
