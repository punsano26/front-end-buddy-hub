export interface IApiResponse<TData> {
  message: string
  data: TData
}

export interface IMessageResponse {
  message: string
}

export interface IApiTokenResponse<TData> {
  message: string
  accessToken: string
  refreshToken: string
  tokenExpireIn: number | null
  data: TData
}

export interface IErrorResponse {
  code: number
  message: string
}


export type TErrorResponse = IErrorResponse | string | any
