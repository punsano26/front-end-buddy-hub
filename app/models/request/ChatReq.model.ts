import type { chatEnum } from '../enums/Chat.enum'
import type { IBasePaginationRequest, IPartnerIdRequest, TBaseParamsId } from './Request.model'

export interface ICreateMessagePayload {
  receiverId?: number
  messageType: chatEnum
  messageText: string
}

export interface IUpdateMessagePayload {
  messageId?: TBaseParamsId
  messageText: string
}


export interface IFindOneMessageFilters {}

export interface IFindAllConversationsFilters {}

export interface IFindOneMessagePaginateQuery extends IBasePaginationRequest, IFindOneMessageFilters, IPartnerIdRequest {}
export interface IFindAllConversationsPaginateQuery extends IBasePaginationRequest, IFindAllConversationsFilters {}
