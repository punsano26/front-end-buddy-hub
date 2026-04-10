import type { chatEnum } from '../enums/Chat.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface ICreateMessageData {
  id: number
  senderId: number
  receiverId: number
  messageType: chatEnum
  messageText: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type ICreateMessageResponse = IApiResponse<ICreateMessageData>

export interface IFindOneMessagePaginateResponse extends IBasePaginationResponse<ICreateMessageData> {}
