import HttpRequest from '../HttpRequest'
import type { IAuthLoginPayload, IAuthRegisterPayload, ICheckAuthPayload, IForgotPasswordPayload } from '~/models/request/AuthReq.model'
import type { IAuthLoginResponse, IAuthRegisterResponse, ICheckAuthResponse, IForgotPasswordResponse } from '~/models/response/AuthRes.model'

export interface IAuthProvider {
  checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse>
  login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse>
  register (payload: IAuthRegisterPayload): Promise<IAuthRegisterResponse>
  forgotPassword (payload: IForgotPasswordPayload): Promise<IForgotPasswordResponse>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
  private urlPrefix: string = '/auth'

  public async checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse> {
    const response = await this.post(`${this.urlPrefix}/check`, payload)
    return response
  }

  public async login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/login`, payload)
    return response
  }

  public async register (payload: IAuthRegisterPayload): Promise<IAuthRegisterResponse> {
    const response = await this.post(`${this.urlPrefix}/register`, payload)
    return response
  }

  public async forgotPassword (payload: IForgotPasswordPayload): Promise<IForgotPasswordResponse> {
    const response = await this.post(`${this.urlPrefix}/forgotPassword
`, payload)
    return response
  }
}

export default AuthProvider
