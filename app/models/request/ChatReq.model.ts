import type { chatEnum } from '../enums/Chat.enum'
import type { IBasePaginationRequest, IFriendsIdRequest } from './Request.model'

export interface ICreateMessagePayload {
  receiverId: number
  messageType: chatEnum
  messageText: string
}

export interface IUpdateMessagePayload {
  messageId: number
  messageText: string
}


export interface IFindOneMessageFilters {}

export interface IFindOneMessagePaginateQuery extends IBasePaginationRequest, IFindOneMessageFilters, IFriendsIdRequest {}
