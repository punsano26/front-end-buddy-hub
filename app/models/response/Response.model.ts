export interface IApiResponse<TData> {
  message: string
  data: TData
}

export interface IErrorResponse {
  code: number
  message: string
}

export type TErrorResponse = IErrorResponse | string | any
