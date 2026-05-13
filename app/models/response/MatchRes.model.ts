import type { IApiResponse } from './Response.model'

export interface IJoinTheRandomMatchQueueData {
  status: string
}

export type IJoinTheRandomMatchQueueResponse = IApiResponse<IJoinTheRandomMatchQueueData>
