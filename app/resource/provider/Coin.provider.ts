import HttpRequest from '../HttpRequest'
import type { IFindAllCoinsPaginateQuery } from '~/models/request/CoinReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllCoinsPaginateResponse, IFindOneCoinByIdResponse } from '~/models/response/CoinRes.model'

export interface ICoinProvider {
  findAllCoinsPaginate (query: IFindAllCoinsPaginateQuery): Promise<IFindAllCoinsPaginateResponse>
  findOneCoinById (id: TBaseParamsId): Promise<IFindOneCoinByIdResponse>
}

class CoinProvider extends HttpRequest implements ICoinProvider {
  private urlPrefix: string = '/coin-packages'

  public async findAllCoinsPaginate (query: IFindAllCoinsPaginateQuery): Promise<IFindAllCoinsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async findOneCoinById (id: TBaseParamsId): Promise<IFindOneCoinByIdResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default CoinProvider
