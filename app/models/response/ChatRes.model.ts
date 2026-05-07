import type { AttachmentTypeEnum } from '../enums/Attachment.enum'
import type { chatEnum } from '../enums/Chat.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IMessageAttachment {
  id: number
  attachmentType: AttachmentTypeEnum
  url: string
  name: string
  size: number
  mimeType: string
}

export interface ICreateMessageData {
  id: number
  senderId: number
  receiverId: number
  messageType: chatEnum
  messageText: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  attachments: IMessageAttachment[]
}

export interface IFindAllUnreadMessagesData {
  unreadCount: number
}

export interface IGetMessageLimitData {
  limitReached: boolean
}

export interface IMessageReadStatus {
  id: number
  isRead: boolean
}

export interface IFindAllConversationsList {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  isOnline: boolean
  lastMessageText: string
  lastMessageType: chatEnum
  lastMessageCreatedAt: string
}

export type ICreateMessageResponse = IApiResponse<ICreateMessageData>
export type IFindAllUnreadMessagesResponse = IApiResponse<IFindAllUnreadMessagesData>
export type IGetMessageLimitResponse = IApiResponse<IGetMessageLimitData>
export type IMarkMessagesAsReadResponse = IApiResponse<IMessageReadStatus[]>
export type IUpdateMessageResponse = IApiResponse<ICreateMessageData>
export type IDeleteMessageResponse = IApiResponse<ICreateMessageData>

export interface IFindOneMessagePaginateResponse extends IBasePaginationResponse<ICreateMessageData> {}
export interface IFindAllConversationsPaginateResponse extends IBasePaginationResponse<IFindAllConversationsList> {}
