import { ref, type Ref } from 'vue'
import type { IPagination } from '@/models/Global.model'

type TPaginationInput = Partial<IPagination> | { pagination?: Partial<IPagination> }

export function useExtractPagination (input?: TPaginationInput | null): IPagination {
  const target = (input && 'pagination' in input && input.pagination) ? input.pagination : (input as Partial<IPagination>)
  return {
    page: target?.page ?? 1,
    limit: target?.limit ?? 20,
    total: target?.total ?? 0,
    lastPage: target?.lastPage ?? 1
  }
}

interface IUsePagination {
  search: Ref<string>
  pagination: Ref<IPagination>
  extractPagination: (input?: TPaginationInput | null) => IPagination
}

export function usePagination (): IUsePagination {
  const search = ref<string>('')
  const pagination = ref<IPagination>({
    page: 1,
    limit: 20,
    total: 0,
    lastPage: 1
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
    pagination.value.total = updateItems.length
    pagination.value.lastPage = Math.ceil(pagination.value.total / pagination.value.limit) || 1
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
