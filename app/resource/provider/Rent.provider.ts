import HttpRequest from '../HttpRequest'
import type { IFindAllRentCategoriesResponse, IFindAllRentTagsResponse } from '~/models/response/RentRes.model'

export interface IRentProvider {
  findAllRentTags (): Promise<IFindAllRentTagsResponse>
  findAllRentCategories (): Promise<IFindAllRentCategoriesResponse>
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
}

export default RentProvider
