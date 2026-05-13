import HttpRequest from '../HttpRequest'
import type { IJoinTheRandomMatchQueuePayload } from '~/models/request/MatchReq.model'
import type { IJoinTheRandomMatchQueueResponse } from '~/models/response/MatchRes.model'

export interface IMatchProvider {
  JoinTheRandomMatchQueue (payload: IJoinTheRandomMatchQueuePayload): Promise<IJoinTheRandomMatchQueueResponse>
}

class MatchProvider extends HttpRequest implements IMatchProvider {
  private urlPrefix: string = '/match'

  public async JoinTheRandomMatchQueue (payload: IJoinTheRandomMatchQueuePayload): Promise<IJoinTheRandomMatchQueueResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/queue`, payload)
    return response
  }
}

export default MatchProvider
