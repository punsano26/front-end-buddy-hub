export type TPaginationLimit = 20 | 50 | 100 | 9999
export interface IPaginationRequest {
  page?: number
  limit?: TPaginationLimit
}


export interface IMenuItem {
  label?: string
  icon?: string
  items?: IMenuItem[]
  command?: () => void
}
export interface IItems {
  label: string
  command: () => void
}

export interface IPagination extends Omit<IPaginationRequest, 'page' | 'limit'> {
  page: number
  limit: TPaginationLimit
  totalPage: number
  count: number
  totalRecords: number
}
export interface IBaseOptions<T = string | number> {
  label: string
  value: T | null | boolean
}
