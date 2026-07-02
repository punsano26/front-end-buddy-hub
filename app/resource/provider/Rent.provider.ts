import HttpRequest from '../HttpRequest'
import type {
  ICreateAReviewPayload,
  ICreateRentPostPayload,
  ICreateTagsRentPayload,
  IFindAllRentPostsPaginateQuery,
  IUpdateRentPostPayload
} from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  ICheckRentPostAlreadyExistsResponse,
  ICreateAReviewResponse,
  ICreateRentPostResponse,
  ICreateTagsRentResponse,
  IFindAllRentCategoriesResponse,
  IFindAllRentPostsPaginateResponse,
  IFindAllRentTagsResponse,
  IFindOneRentPostResponse
} from '~/models/response/RentRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IRentProvider {
  findAllRentTags (): Promise<IFindAllRentTagsResponse>
  findAllRentCategories (): Promise<IFindAllRentCategoriesResponse>
  findAllRentPostsPaginate (query: IFindAllRentPostsPaginateQuery): Promise<IFindAllRentPostsPaginateResponse>
  findOneRentPostById (id: TBaseParamsId): Promise<IFindOneRentPostResponse>
  createRentPost (payload: ICreateRentPostPayload): Promise<ICreateRentPostResponse>
  checkRentPostAlreadyExists (): Promise<ICheckRentPostAlreadyExistsResponse>
  createTagsRent (payload: ICreateTagsRentPayload): Promise<ICreateTagsRentResponse>
  findOneMyRentPost (): Promise<IFindOneRentPostResponse>
  updateRentPost (id: TBaseParamsId, payload: IUpdateRentPostPayload): Promise<IFindOneRentPostResponse>
  deleteRentPost (id: TBaseParamsId): Promise<IMessageResponse>
  createAReview (payload: ICreateAReviewPayload): Promise<ICreateAReviewResponse>
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

  public async checkRentPostAlreadyExists (): Promise<ICheckRentPostAlreadyExistsResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/me/has-post`)
    return response
  }

  public async createTagsRent (payload: ICreateTagsRentPayload): Promise<ICreateTagsRentResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/tags`, payload)
    return response
  }

  public async findOneMyRentPost (): Promise<IFindOneRentPostResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/me`)
    return response
  }

  public async updateRentPost (id: TBaseParamsId, payload: IUpdateRentPostPayload): Promise<IFindOneRentPostResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteRentPost (id: TBaseParamsId): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createAReview (payload: ICreateAReviewPayload): Promise<ICreateAReviewResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/reviews`, payload)
    return response
  }
}

export default RentProvider
