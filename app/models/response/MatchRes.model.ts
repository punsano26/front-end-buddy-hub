import type { IApiResponse } from './Response.model'

export interface IJoinTheRandomMatchQueueData {
  status: string
}

export interface ILeaveTheRandomMatchQueueData {
  removed: boolean
}

export type ILeaveTheRandomMatchQueueResponse = IApiResponse<ILeaveTheRandomMatchQueueData>
export type IJoinTheRandomMatchQueueResponse = IApiResponse<IJoinTheRandomMatchQueueData>
