<template>
  <Paginator
    :first="(pagination.page - 1) * pagination.limit"
    :rows="pagination.limit"
    :total-records="pagination.total"
    pt:root:class="justify-center px-4 py-1 bg-transparent dark:bg-transparent"
    @page="onPageChange($event)" />
</template>

<script setup lang="ts">
import type { IPagination, TPaginationLimit } from '~/models/Global.model'

interface IEmits {
  page: [pagination: IPagination]
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>({
  default: (): IPagination => ({
    page: 1,
    limit: 20,
    total: 0,
    lastPage: 1
  })
})

function onPageChange (event: { page: number, rows: number }): void {
  pagination.value.page = event.page + 1
  pagination.value.limit = event.rows as TPaginationLimit
  emits('page', pagination.value)
}
</script>
