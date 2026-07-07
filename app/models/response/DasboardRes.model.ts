import type { IApiResponse } from './Response.model'

export interface IRevenueTrend {
  date: string
  revenue: number
}

export interface IFindAllRentStatisticsData {
  todayRevenue: number
  totalRevenue: number
  averageRating: number
  reviewCount: number
  serviceDurationMinutes: number
  revenueTrends: IRevenueTrend[]
}

export type IFindAllRentStatisticsResponse = IApiResponse<IFindAllRentStatisticsData>
