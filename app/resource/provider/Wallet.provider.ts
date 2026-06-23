import HttpRequest from '../HttpRequest'
import type { IFindWalletBalanceResponse } from '~/models/response/WallRes.model'

export interface IWalletProvider {
  findWalletBalance (): Promise<IFindWalletBalanceResponse>
}

class WalletProvider extends HttpRequest implements IWalletProvider {
  private urlPrefix: string = '/wallet'

  public async findWalletBalance (): Promise<IFindWalletBalanceResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`)
    return response
  }
}

export default WalletProvider
