import HttpRequest from '../HttpRequest'
import type { IFindTheLatestPolicyResponse } from '~/models/response/Policy.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IPolicyProvider {

  findTheLatestPolicy (): Promise<IFindTheLatestPolicyResponse>
  acceptPolicy (payload: number): Promise<IMessageResponse>

}

class PolicyProvider extends HttpRequest implements IPolicyProvider {
  private urlPrefix: string = '/policies'


  public async findTheLatestPolicy (): Promise<IFindTheLatestPolicyResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/latest`)
    return response
  }

  public async acceptPolicy (payload: number): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/${payload}/accept`, {})
    return response
  }
}

export default PolicyProvider
