export interface IListPackagesQuery {
  search?: string
  page?: number
  limit?: number
}

export interface IListSubscriptionsQuery {
  status?: string
  page?: number
  limit?: number
}
