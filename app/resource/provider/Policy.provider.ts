import HttpRequest from '../HttpRequest'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ICreatePolicyPayload, IFindPoliciesPaginateQuery } from '~/models/request/PolicyReq.model'
import type {
  IFindLatestPoliciesResponse,
  IFindPolicyDetailResponse,
  IConsentStatusResponse,
  IRecordConsentResponse,
  IFindPoliciesPaginateResponse
} from '~/models/response/PolicyRes.model'

export interface IPolicyProvider {
  findLatestPolicies (): Promise<IFindLatestPoliciesResponse>
  getConsentStatus (): Promise<IConsentStatusResponse>
  recordConsent (): Promise<IRecordConsentResponse>
  findAllPoliciesPaginate (query: IFindPoliciesPaginateQuery): Promise<IFindPoliciesPaginateResponse>
  createPolicy (payload: ICreatePolicyPayload): Promise<IFindPolicyDetailResponse>
  findPolicyById (id: TBaseParamsId): Promise<IFindPolicyDetailResponse>
  togglePolicyStatus (id: TBaseParamsId): Promise<IFindPolicyDetailResponse>
}

class PolicyProvider extends HttpRequest implements IPolicyProvider {
  private urlPrefix: string = '/policies'

  public async findLatestPolicies (): Promise<IFindLatestPoliciesResponse> {
    const response = await this.get(`${this.urlPrefix}/latest`)
    return response
  }

  public async getConsentStatus (): Promise<IConsentStatusResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/consent`)
    return response
  }

  public async recordConsent (): Promise<IRecordConsentResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}/consent`, {})
    return response
  }

  public async findAllPoliciesPaginate (query: IFindPoliciesPaginateQuery): Promise<IFindPoliciesPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async createPolicy (payload: ICreatePolicyPayload): Promise<IFindPolicyDetailResponse> {
    this.setUserAuthHeader()
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  public async findPolicyById (id: TBaseParamsId): Promise<IFindPolicyDetailResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async togglePolicyStatus (id: TBaseParamsId): Promise<IFindPolicyDetailResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}`, {})
    return response
  }
}

export default PolicyProvider
