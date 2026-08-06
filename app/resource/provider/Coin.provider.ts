import HttpRequest from '../HttpRequest'
import type { IFindAllCoinsPaginateQuery } from '~/models/request/CoinReq.model'
import type { IFindAllCoinsPaginateResponse } from '~/models/response/CoinRes.model'

export interface ICoinProvider {
  findAllCoinsPaginate (query: IFindAllCoinsPaginateQuery): Promise<IFindAllCoinsPaginateResponse>
}

class CoinProvider extends HttpRequest implements ICoinProvider {
  private urlPrefix: string = '/coins'

  public async findAllCoinsPaginate (query: IFindAllCoinsPaginateQuery): Promise<IFindAllCoinsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }
}

export default CoinProvider
