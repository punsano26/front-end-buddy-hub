import type { NotificationTypeEnum } from '../enums/Notification.enum'
import type { IBasePaginationRequest } from './Request.model'

export interface IFindNotificationFilters {
  notificationType?: NotificationTypeEnum
}

export interface IFindAllNotificationPaginateQuery extends IBasePaginationRequest, IFindNotificationFilters {}

export interface ICreateNotificationPayload {
  title: string
  content: string
  notificationType: NotificationTypeEnum
  userId?: number
  friendRequestId?: number
}
