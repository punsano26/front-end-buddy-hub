import HttpRequest from '../HttpRequest'
import type {
  IAuthLoginPayload,
  IAuthRegisterPayload,
  ICheckAuthPayload,
  IForgotPasswordPayload,
  IReFreshTokenPayload,
  IResetPasswordPayload
} from '~/models/request/AuthReq.model'
import type { IAuthLoginResponse, ICheckAuthResponse, IForgotPasswordResponse } from '~/models/response/AuthRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IAuthProvider {
  checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse>
  login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse>
  register (payload: IAuthRegisterPayload): Promise<IAuthLoginResponse>
  forgotPassword (payload: IForgotPasswordPayload): Promise<IForgotPasswordResponse>
  resetForgotPassword (payload: IResetPasswordPayload): Promise<IMessageResponse>
  refreshToken (payload: IReFreshTokenPayload): Promise<IAuthLoginResponse>
  logout (): Promise<IMessageResponse>
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

  public async register (payload: IAuthRegisterPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/register`, payload)
    return response
  }

  public async forgotPassword (payload: IForgotPasswordPayload): Promise<IForgotPasswordResponse> {
    const response = await this.post(`${this.urlPrefix}/forgotPassword`, payload)
    return response
  }

  public async resetForgotPassword (payload: IResetPasswordPayload): Promise<IMessageResponse> {
    this.setAuthResetHeader()
    const response = await this.patch(`${this.urlPrefix}/resetForgotPassword`, payload)
    return response
  }

  public async logout (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/logout`, {})
    return response
  }

  public async refreshToken (payload: IReFreshTokenPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/refresh`, payload)
    return response
  }
}

export default AuthProvider
