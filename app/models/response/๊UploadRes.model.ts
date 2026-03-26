import type { IApiResponse } from './Response.model'

export interface ICreateUploadData {
  url: string
  filename: string

}
export type ICreateUploadResponse = IApiResponse<ICreateUploadData>
