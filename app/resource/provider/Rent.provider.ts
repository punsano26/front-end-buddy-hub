import HttpRequest from '../HttpRequest'
import type { ICreateRentPostPayload, IFindAllRentPostsPaginateQuery } from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  ICreateRentPostResponse,
  IFindAllRentCategoriesResponse,
  IFindAllRentPostsPaginateResponse,
  IFindAllRentTagsResponse,
  IFindOneRentPostResponse
} from '~/models/response/RentRes.model'

export interface IRentProvider {
  findAllRentTags (): Promise<IFindAllRentTagsResponse>
  findAllRentCategories (): Promise<IFindAllRentCategoriesResponse>
  findAllRentPostsPaginate (query: IFindAllRentPostsPaginateQuery): Promise<IFindAllRentPostsPaginateResponse>
  findOneRentPostById (id: TBaseParamsId): Promise<IFindOneRentPostResponse>
  createRentPost (payload: ICreateRentPostPayload): Promise<ICreateRentPostResponse>
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
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async findOneRentPostById (id: TBaseParamsId): Promise<IFindOneRentPostResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createRentPost (payload: ICreateRentPostPayload): Promise<ICreateRentPostResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }
}

export default RentProvider
