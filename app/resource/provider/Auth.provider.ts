import HttpRequest from '../HttpRequest'
import type { IAuthLoginPayload, ICheckAuthPayload } from '~/models/request/AuthReq.model'
import type { IAuthLoginResponse, ICheckAuthResponse } from '~/models/response/AuthRes.model'

export interface IAuthProvider {
  checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse>
  login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
  private urlPrefix: string = '/auth'

  public async checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse> {
    const response = await this.post(`${this.urlPrefix}/checkUser`, payload)
    return response
  }

  public async login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/login`, payload)
    return response
  }
}

export default AuthProvider
