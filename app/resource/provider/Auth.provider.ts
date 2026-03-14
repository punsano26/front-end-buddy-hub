import HttpRequest from '../HttpRequest'
import type { ICheckAuthPayload } from '~/models/request/AuthReq.model'
import type { ICheckAuthResponse } from '~/models/response/AuthRes.model'

export interface IAuthProvider {
  checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
  private urlPrefix: string = '/auth'

  public async checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse> {
    const response = await this.post(`${this.urlPrefix}/checkUser`, payload)
    return response
  }
}

export default AuthProvider
