import HttpRequest from '../HttpRequest'
import type { ISendCoinsToAnotherUserPayload } from '~/models/request/WalletReq.model'
import type { IFindWalletBalanceResponse, ISendCoinsToAnotherUserResponse } from '~/models/response/WallRes.model'

export interface IWalletProvider {
  findWalletBalance (): Promise<IFindWalletBalanceResponse>
  sendCoinsToAnotherUser (payload: ISendCoinsToAnotherUserPayload): Promise<ISendCoinsToAnotherUserResponse>
}

class WalletProvider extends HttpRequest implements IWalletProvider {
  private urlPrefix: string = '/wallet'

  public async findWalletBalance (): Promise<IFindWalletBalanceResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`)
    return response
  }

  public async sendCoinsToAnotherUser (payload: ISendCoinsToAnotherUserPayload): Promise<ISendCoinsToAnotherUserResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/transfer`, payload)
    return response
  }
}

export default WalletProvider
