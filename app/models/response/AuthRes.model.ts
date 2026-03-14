import type { IApiResponse } from './Response.model'

export interface ICheckAuthData {
  isExisting: boolean
}

export type ICheckAuthResponse = IApiResponse<ICheckAuthData>
