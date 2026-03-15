export interface IApiResponse<TData> {
  message: string
  data: TData
}

export interface IApiTokenResponse<TData> {
  message: string
  token: string
  refreshToken: string
  expireIn: number | null
  data: TData
}

export interface IErrorResponse {
  code: number
  message: string
}

export type TErrorResponse = IErrorResponse | string | any
