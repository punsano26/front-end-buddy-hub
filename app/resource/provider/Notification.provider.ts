import HttpRequest from '../HttpRequest'
import type { ICreateNotificationPayload, IFindAllNotificationPaginateQuery } from '~/models/request/NotificationReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type {
  ICreateNotificationResponse,
  IDeleteNotificationResponse,
  IFindAllNotificationPaginateResponse,
  IFindUnreadNotificationCountResponse,
  IMarkAllNotificationsAsReadResponse,
  IMarkNotificationAsReadResponse
} from '~/models/response/NotificationRes.model'

export interface INotificationProvider {
  findAllNotificationPaginate (query: IFindAllNotificationPaginateQuery): Promise<IFindAllNotificationPaginateResponse>
  markNotificationAsRead (id: TBaseParamsId): Promise<IMarkNotificationAsReadResponse>
  markAllNotificationsAsRead (): Promise<IMarkAllNotificationsAsReadResponse>
  deleteNotification (id: TBaseParamsId): Promise<IDeleteNotificationResponse>
  createNotification (payload: ICreateNotificationPayload): Promise<ICreateNotificationResponse>
  findUnreadNotificationCount (): Promise<IFindUnreadNotificationCountResponse>
}

class NotificationProvider extends HttpRequest implements INotificationProvider {
  private urlPrefix: string = '/notifications'


  public async findAllNotificationPaginate (query: IFindAllNotificationPaginateQuery): Promise<IFindAllNotificationPaginateResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async markNotificationAsRead (id: TBaseParamsId): Promise<IMarkNotificationAsReadResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/${id}/read`, {})
    return response
  }

  public async markAllNotificationsAsRead (): Promise<IMarkAllNotificationsAsReadResponse> {
    this.setUserAuthHeader()
    const response = await this.patch(`${this.urlPrefix}/read-all`, {})
    return response
  }

  public async deleteNotification (id: TBaseParamsId): Promise<IDeleteNotificationResponse> {
    this.setUserAuthHeader()
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createNotification (payload: ICreateNotificationPayload): Promise<ICreateNotificationResponse> {
    this.setUserAuthHeader()
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async findUnreadNotificationCount (): Promise<IFindUnreadNotificationCountResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/unread-count`)
    return response
  }
}

export default NotificationProvider
