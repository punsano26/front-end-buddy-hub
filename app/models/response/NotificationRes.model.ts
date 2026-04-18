import type { IBasePaginationResponse } from './Response.model'

export interface INotificationList {
  id: number
  userId: number
  title: string
  content: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export interface IFindAllNotificationPaginateResponse extends IBasePaginationResponse<INotificationList> {}
