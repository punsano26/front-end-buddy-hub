import type { IApiResponse } from './Response.model'

export interface IJoinTheRandomMatchQueueData {
  status: string
}

export interface ILeaveTheRandomMatchQueueData {
  removed: boolean
}

export interface ISendASessionMessageData {

}

export type IFindAllSessionMessagesResponse = IApiResponse<ISendASessionMessageData>
export type ISendASessionMessageResponse = IApiResponse<ISendASessionMessageData>
export type ILeaveTheRandomMatchQueueResponse = IApiResponse<ILeaveTheRandomMatchQueueData>
export type IJoinTheRandomMatchQueueResponse = IApiResponse<IJoinTheRandomMatchQueueData>
