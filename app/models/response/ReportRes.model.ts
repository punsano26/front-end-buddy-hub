import type { BanDurationEnum, ReportStatusEnum } from '../enums/Report.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IReportData {
  id: number
  reporterId: number
  reportedId: number
  reason: string
  status: ReportStatusEnum
  reviewedBy: number | null
  reviewNote: string | null
  banDuration: BanDurationEnum | null
  reviewedAt: string | null
  createdAt: string
}

export interface IReportWithUsersData extends IReportData {
  reporterUsername: string
  reporterNickname: string | null
  reporterProfileImg: string | null
  reportedUsername: string
  reportedNickname: string | null
  reportedProfileImg: string | null
  reviewerUsername: string | null
}

export interface IBanStatusData {
  isBanned: boolean
  banDuration: BanDurationEnum | null
  expiresAt: string | null
  bannedAt: string | null
  reason: string | null
}

export type ICreateReportResponse = IApiResponse<IReportData>
export type IReportDetailResponse = IApiResponse<IReportWithUsersData>
export type IBanStatusResponse = IApiResponse<IBanStatusData>
export interface IListReportsResponse extends IBasePaginationResponse<IReportWithUsersData> {}
