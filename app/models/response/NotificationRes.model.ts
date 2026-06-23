import type { FriendRequestStatusEnum } from '../enums/Friend.enum'
import type { NotificationTypeEnum } from '../enums/Notification.enum'
import type { RentStatusEnum } from '../enums/Rent.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface INotificationList {
  id: number
  userId: number
  title: string | null
  content: string | null
  isRead: boolean
  notificationType: NotificationTypeEnum
  relatedUserId: number
  relatedUserProfileImg: string | null
  requestStatus: FriendRequestStatusEnum
  hireSessionId: number
  hireSessionStatus: RentStatusEnum | null
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
