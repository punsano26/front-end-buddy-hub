export type TPaginationLimit = 5 | 10 | 20 | 50 | 100
export interface IPaginationRequest {
  page?: number
  limit?: number
}


export interface IMenuItem {
  label?: string
  icon?: string
  items?: IMenuItem[]
  command?: () => void
}
export interface IItems {
  icon?: string
  label: string
  command: () => void
}

export interface IPagination {
  total?: number
  limit: number
  page: number
  lastPage?: number
}
export interface IBaseOptions<T = string | number> {
  label: string
  value: T | null | boolean
}
