import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { NotificationTypeEnum } from '../enums/Notification.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface INotificationList {
  id: number
  userId: number | null
  title: string
  content: string
  isRead: boolean
  notificationType: NotificationTypeEnum
  requesterId: number | null
  requesterProfileImg: string | null
  requestStatus: FriendRequestStatusEnum | null
  createdAt: string
  updatedAt: string
}

export interface IDeleteNotificationData {
  notificationId: number
}

export interface IFindUnreadNotificationCountData {
  count: number
}

export type IFindUnreadNotificationCountResponse = IApiResponse<IFindUnreadNotificationCountData>
export type IMarkNotificationAsReadResponse = IApiResponse<INotificationList>
export type IDeleteNotificationResponse = IApiResponse<IDeleteNotificationData>
export type ICreateNotificationResponse = IApiResponse<INotificationList>

export interface IFindAllNotificationPaginateResponse extends IBasePaginationResponse<INotificationList> {}
export interface IMarkAllNotificationsAsReadResponse extends IBasePaginationResponse<INotificationList> {}
