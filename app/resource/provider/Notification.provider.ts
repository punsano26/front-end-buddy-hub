import HttpRequest from '../HttpRequest'
import type { IFindAllNotificationPaginateQuery } from '~/models/request/NotificationReq.model'
import type { IFindAllNotificationPaginateResponse } from '~/models/response/NotificationRes.model'

export interface INotificationProvider {

  findAllNotificationPaginate (query: IFindAllNotificationPaginateQuery): Promise<IFindAllNotificationPaginateResponse>

}

class NotificationProvider extends HttpRequest implements INotificationProvider {
  private urlPrefix: string = '/notifications'


  public async findAllNotificationPaginate (query: IFindAllNotificationPaginateQuery): Promise<IFindAllNotificationPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default NotificationProvider
