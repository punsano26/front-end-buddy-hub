import type { chatEnum } from '../enums/Chat.enum'
import type { AttachmentsTypeEnum, RentStatusEnum } from '../enums/Rent.enum'
import type { IApiResponse, IBasePaginationResponse } from './Response.model'

export interface IRentAPostData {
  id: number
  customerId: number
  hirePostId: number
  coinTransactionId: number
  coinPaid: number
  durationMinutes: number
  status: RentStatusEnum
  acceptedAt: string | null
  startedAt: string | null
  expiresAt: string | null
  endedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  customer: ICustomer
  provider: IProvider
  hirePost: IHirePost
  requestCompleteBy?: number | null
  requestCompletedBy?: number | null
  completionRequestedBy?: number | null
  isCompleting?: boolean | null
}

export interface ICustomer {
  id: number
  username: string
  nickname: string
  profileImg: string
  isOnline: boolean
}

export interface IHirePost {
  id: number
  tagline: string
}

export interface IFindAllRentTagsData {
  id: number
  name: string
  isActive: boolean
}

export interface IFindAllRentCategoriesData {
  id: number
  name: string
  description: string
  isActive: boolean
}

export interface IFindAllRentPostList {
  id: number
  userId: number
  categoryId: number
  tagline: string
  description: string
  coinRatePerMinute: number
  maxDurationMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  category: IFindAllRentCategoriesData
  provider: IProvider
  tags: string[]
  isOnline: boolean
}

export interface IProvider {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
  isOnline: boolean
  rating: IRating
}

export interface IRating {
  averageRating: number | null
  reviewCount: number
}

export interface ICreateTagsRentData {
  id: number
  name: string
  isActive: boolean
}

export interface ICheckRentPostAlreadyExistsData {
  hasPost: boolean
}

export interface IFindAllConversationSessionsList {

}

export interface IFindOneSessionsMessagesList {
  id: number
  senderId: number
  receiverId: number
  hireSessionId: number
  messageType: chatEnum
  messageText: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  attachments: IMessageAttachment[]
}

export interface IMessageAttachment {
  id: number | null
  attachmentType: AttachmentsTypeEnum | null
  url: string | null
  name: string | null
  size: number | null
  mimeType: string | null
}

export interface IFindRealtimeSessionMessagesData {
  sessionId: number
  sessionExpiresAt: Date | null
  sessionRemainingSeconds: number
  completingExpiresAt: Date | null
  completingRemainingSeconds: number
}

export interface ICheckIfSessionIsExpiredData {
  sessionId: number
  expired: boolean
  status: RentStatusEnum
}

export type IFindRealtimeSessionMessagesResponse = IApiResponse<IFindRealtimeSessionMessagesData>
export type ICheckIfSessionIsExpiredResponse = IApiResponse<ICheckIfSessionIsExpiredData>
export type ICreateSessionMessageResponse = IApiResponse<IFindOneSessionsMessagesList>
export type ICheckRentPostAlreadyExistsResponse = IApiResponse<ICheckRentPostAlreadyExistsData>
export type ICreateTagsRentResponse = IApiResponse<ICreateTagsRentData[]>
export type IFindAllRentTagsResponse = IApiResponse<IFindAllRentTagsData[]>
export type IFindAllRentCategoriesResponse = IApiResponse<IFindAllRentCategoriesData[]>
export type IFindOneRentPostResponse = IApiResponse<IFindAllRentPostList>
export type ICreateRentPostResponse = IApiResponse<IFindAllRentPostList>
export interface IFindAllRentPostsPaginateResponse extends IBasePaginationResponse<IFindAllRentPostList> {}
export interface IFindAllConversationSessionsPaginateResponse extends IBasePaginationResponse<IRentAPostData> {}
export interface IFindOneSessionsMessagesPaginateResponse extends IBasePaginationResponse<IFindOneSessionsMessagesList> {}


export type IRentAPostResponse = IApiResponse<IRentAPostData>
