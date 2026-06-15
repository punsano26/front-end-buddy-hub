import HttpRequest from '../HttpRequest'
import type { IFindAllRentPostsPaginateQuery } from '~/models/request/RentReq.model'
import type { IFindAllRentCategoriesResponse, IFindAllRentPostsPaginateResponse, IFindAllRentTagsResponse } from '~/models/response/RentRes.model'

export interface IRentProvider {
  findAllRentTags (): Promise<IFindAllRentTagsResponse>
  findAllRentCategories (): Promise<IFindAllRentCategoriesResponse>
  findAllRentPostsPaginate (query: IFindAllRentPostsPaginateQuery): Promise<IFindAllRentPostsPaginateResponse>
}

class RentProvider extends HttpRequest implements IRentProvider {
  private urlPrefix: string = '/hire-posts'

  public async findAllRentTags (): Promise<IFindAllRentTagsResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/tags`)
    return response
  }

  public async findAllRentCategories (): Promise<IFindAllRentCategoriesResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/categories`)
    return response
  }

  public async findAllRentPostsPaginate (query: IFindAllRentPostsPaginateQuery): Promise<IFindAllRentPostsPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, { params: query })
    return response
  }
}

export default RentProvider
