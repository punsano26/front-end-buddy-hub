import HttpRequest from '../HttpRequest'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IInitiateCallResponse } from '~/models/response/CallRes.model'

export interface ICallProvider {
  InitiateCall (id: TBaseParamsId): Promise<IInitiateCallResponse>
  AcceptIncomingCall (id: TBaseParamsId): Promise<IInitiateCallResponse>
  RejectIncomingCall (id: TBaseParamsId): Promise<IInitiateCallResponse>
  EndCall (id: TBaseParamsId): Promise<IInitiateCallResponse>
}

class CallProvider extends HttpRequest implements ICallProvider {
  private urlPrefix: string = '/calls'

  public async InitiateCall (id: TBaseParamsId): Promise<IInitiateCallResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/${id}`, {})
    return response
  }

  public async AcceptIncomingCall (id: TBaseParamsId): Promise<IInitiateCallResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}/accept`, {})
    return response
  }

  public async RejectIncomingCall (id: TBaseParamsId): Promise<IInitiateCallResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}/reject`, {})
    return response
  }

  public async EndCall (id: TBaseParamsId): Promise<IInitiateCallResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}/end`, {})
    return response
  }
}

export default CallProvider
