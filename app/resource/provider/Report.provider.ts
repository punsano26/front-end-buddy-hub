import HttpRequest from '../HttpRequest'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ICreateReportPayload, IReviewReportPayload, IListReportsQuery } from '~/models/request/ReportReq.model'
import type {
  ICreateReportResponse,
  IBanStatusResponse,
  IReportDetailResponse,
  IListReportsResponse
} from '~/models/response/ReportRes.model'
import type { IMessageResponse } from '~/models/response/Response.model'

export interface IReportProvider {
  createReport (payload: ICreateReportPayload): Promise<ICreateReportResponse>
  checkBanStatus (userId: TBaseParamsId): Promise<IBanStatusResponse>
  listReports (query?: IListReportsQuery): Promise<IListReportsResponse>
  getReportById (reportId: TBaseParamsId): Promise<IReportDetailResponse>
  reviewReport (reportId: TBaseParamsId, payload: IReviewReportPayload): Promise<ICreateReportResponse>
  unbanUser (userId: TBaseParamsId): Promise<IMessageResponse>
}

class ReportProvider extends HttpRequest implements IReportProvider {
  private urlPrefix: string = '/reports'

  public async createReport (payload: ICreateReportPayload): Promise<ICreateReportResponse> {
    this.setUserAuthHeader()
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  public async checkBanStatus (userId: TBaseParamsId): Promise<IBanStatusResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/ban-status/${userId}`)
    return response
  }

  public async listReports (query?: IListReportsQuery): Promise<IListReportsResponse> {
    this.setUserAuthHeader()
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async getReportById (reportId: TBaseParamsId): Promise<IReportDetailResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/${reportId}`)
    return response
  }

  public async reviewReport (reportId: TBaseParamsId, payload: IReviewReportPayload): Promise<ICreateReportResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${reportId}/review`, payload)
    return response
  }

  public async unbanUser (userId: TBaseParamsId): Promise<IMessageResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/bans/${userId}/unban`, {})
    return response
  }
}

export default ReportProvider
