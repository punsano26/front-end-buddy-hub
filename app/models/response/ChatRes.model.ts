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

export interface IFindAllUnreadMessagesData {
  unreadCount: number
}

export interface IFindAllConversationsList {
  id: number
  username: string
  nickname: string | null
  isOnline: boolean
  lastMessage: string
  profileImg: string
  createdAt: string
  messageType: chatEnum
}

export type ICreateMessageResponse = IApiResponse<ICreateMessageData>
export type IFindAllUnreadMessagesResponse = IApiResponse<IFindAllUnreadMessagesData>

export interface IFindOneMessagePaginateResponse extends IBasePaginationResponse<ICreateMessageData> {}
export interface IFindAllConversationsPaginateResponse extends IBasePaginationResponse<IFindAllConversationsList> {}
