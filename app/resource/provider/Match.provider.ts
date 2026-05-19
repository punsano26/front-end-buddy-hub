import HttpRequest from '../HttpRequest'
import type { IJoinTheRandomMatchQueuePayload } from '~/models/request/MatchReq.model'
import type { IJoinTheRandomMatchQueueResponse, ILeaveTheRandomMatchQueueResponse } from '~/models/response/MatchRes.model'

export interface IMatchProvider {
  JoinTheRandomMatchQueue (payload: IJoinTheRandomMatchQueuePayload): Promise<IJoinTheRandomMatchQueueResponse>
  LeaveTheRandomMatchQueue (): Promise<ILeaveTheRandomMatchQueueResponse>
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
}

export default MatchProvider
