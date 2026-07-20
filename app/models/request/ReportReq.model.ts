import type { BanDurationEnum, ReportStatusEnum } from '../enums/Report.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface ICreateReportPayload {
  reportedId: number
  reason: string // 10-500 chars
}

export interface IReviewReportPayload {
  banDuration: BanDurationEnum
  reviewNote?: string
}

export interface IListReportsQuery extends IBasePaginationRequest {
  status?: ReportStatusEnum
}
