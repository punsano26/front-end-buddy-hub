import type { ICreateMessageData } from './ChatRes.model'
import type { IApiResponse } from './Response.model'

export interface IUploadUrlResultData {
  url: string
}

export type IUploadResultData = IUploadUrlResultData | ICreateMessageData

export type ICreateUploadResponse = IApiResponse<IUploadResultData>
