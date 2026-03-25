import { ref, type Ref } from 'vue'
import type { IPagination } from '@/models/Global.model'

export function useExtractPagination (input?: Partial<IPagination>): IPagination {
  return {
    page: input?.page ?? 1,
    limit: input?.limit ?? 20,
    count: input?.count ?? 0,
    totalPage: input?.totalPage ?? 1
  }
}

interface IUsePagination {
  search: Ref<string>
  pagination: Ref<IPagination>
  extractPagination: (input?: Partial<IPagination>) => IPagination
}

export function usePagination (): IUsePagination {
  const search = ref<string>('')
  const pagination = ref<IPagination>({
    page: 1,
    totalPage: 1,
    count: 0,
    limit: 20
  })

  return {
    search,
    pagination,
    extractPagination: useExtractPagination
  }
}

interface IUseLocalPagination<T> extends IUsePagination {
  displayItems: Ref<T[]>
  updateItems(updateItems: T[]): void
  updatePagination(): void
}

export function useLocalPagination<T> (inputItems: T[] = []): IUseLocalPagination<T> {
  const { search, pagination, extractPagination } = usePagination()

  const items = ref<T[]>([]) as Ref<T[]>
  const displayItems = ref<T[]>([]) as Ref<T[]>

  function updatePagination (): void {
    const startItem = (pagination.value.page - 1) * pagination.value.limit
    const endItem = pagination.value.page * pagination.value.limit
    displayItems.value = items.value.slice(startItem, endItem)
  }

  function updateItems (updateItems: T[] = []): void {
    items.value = [...updateItems]
    pagination.value.count = updateItems.length
    pagination.value.totalPage = Math.ceil(pagination.value.count / pagination.value.limit) || 1
    updatePagination()
  }

  updateItems(inputItems)

  return {
    search,
    pagination,
    extractPagination,
    displayItems,
    updateItems,
    updatePagination
  }
}

export default usePagination
