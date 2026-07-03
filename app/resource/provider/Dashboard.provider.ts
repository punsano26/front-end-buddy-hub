import HttpRequest from '../HttpRequest'
import type { IFindAllRentStatisticsResponse } from '~/models/response/DasboardRes.model'

export interface IDashboardProvider {
  findAllRentStatistics (): Promise<IFindAllRentStatisticsResponse>
}

class DashboardProvider extends HttpRequest implements IDashboardProvider {
  private urlPrefix: string = '/dashboard'

  public async findAllRentStatistics (): Promise<IFindAllRentStatisticsResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/provider-hire-stats`)
    return response
  }
}

export default DashboardProvider
