import HttpRequest from '../HttpRequest'
import type {
  IAuthLoginPayload,
  IAuthRegisterPayload,
  IChangeEmail,
  IChangePasswordPayload,
  ICheckAuthPayload,
  IFindAllSessionsPaginateQuery,
  IForgotPasswordPayload,
  IReFreshTokenPayload,
  IResetPasswordPayload
} from '~/models/request/AuthReq.model'
import type { IAuthLoginResponse, ICheckAuthResponse, IFindAllSessionsPaginateResponse } from '~/models/response/AuthRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IAuthProvider {
  checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse>
  changeEmail (payload: IChangeEmail): Promise<IMessageResponse>
  changePassword (payload: IChangePasswordPayload): Promise<IMessageResponse>
  login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse>
  register (payload: IAuthRegisterPayload): Promise<IAuthLoginResponse>
  forgotPassword (payload: IForgotPasswordPayload): Promise<IMessageResponse>
  resetForgotPassword (payload: IResetPasswordPayload): Promise<IMessageResponse>
  refreshToken (payload: IReFreshTokenPayload): Promise<IAuthLoginResponse>
  sendEmailVerification (): Promise<IMessageResponse>
  verifyEmail (token?: string): Promise<IMessageResponse>
  logout (): Promise<IMessageResponse>
  listSessions (query: IFindAllSessionsPaginateQuery): Promise<IFindAllSessionsPaginateResponse>
  revokeSession (refreshToken: string): Promise<IMessageResponse>
  revokeAllOtherSessions (): Promise<IMessageResponse>
}

class AuthProvider extends HttpRequest implements IAuthProvider {
  private urlPrefix: string = '/auth'

  public async checkAuth (payload: ICheckAuthPayload): Promise<ICheckAuthResponse> {
    const response = await this.post(`${this.urlPrefix}/account-lookups`, payload)
    return response
  }

  public async login (payload: IAuthLoginPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/sessions`, payload)
    return response
  }

  public async register (payload: IAuthRegisterPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/registrations`, payload)
    return response
  }

  public async forgotPassword (payload: IForgotPasswordPayload): Promise<IMessageResponse> {
    const response = await this.post(`${this.urlPrefix}/password-reset-requests`, payload)
    return response
  }

  public async resetForgotPassword (payload: IResetPasswordPayload): Promise<IMessageResponse> {
    const response = await this.patch(`${this.urlPrefix}/password/reset`, payload)
    return response
  }

  public async logout (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const authStore = useAuthStore()
    const response = await this.delete(`${this.urlPrefix}/sessions/current`, undefined, {
      refreshToken: authStore.userToken.refreshToken
    })
    return response
  }

  public async listSessions (query: IFindAllSessionsPaginateQuery): Promise<IFindAllSessionsPaginateResponse> {
    this.setUserAuthHeader()
    const authStore = useAuthStore()
    const response = await this.get(`${this.urlPrefix}/sessions`, undefined, {
      headers: {
        'x-refresh-token': authStore.userToken.refreshToken
      },
      params: query
    })
    return response
  }

  public async revokeSession (refreshToken: string): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/sessions/current`, undefined, {
      refreshToken
    })
    return response
  }

  public async revokeAllOtherSessions (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const authStore = useAuthStore()
    const response = await this.delete(`${this.urlPrefix}/sessions`, undefined, {
      refreshToken: authStore.userToken.refreshToken
    })
    return response
  }

  public async refreshToken (payload: IReFreshTokenPayload): Promise<IAuthLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/sessions/refresh`, payload)
    return response
  }

  public async changeEmail (payload: IChangeEmail): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/email`, payload)
    return response
  }

  public async changePassword (payload: IChangePasswordPayload): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/password`, payload)
    return response
  }

  public async sendEmailVerification (): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/email-verifications`, {})
    return response
  }

  public async verifyEmail (token?: string): Promise<IMessageResponse> {
    const response = await this.patch(`${this.urlPrefix}/email/verification`, { token: token || '' })
    return response
  }
}

export default AuthProvider
