<template>
  <Paginator
    :first="(pagination.page - 1) * pagination.limit"
    :rows="pagination.limit"
    :total-records="pagination.total"
    pt:root:class="justify-end px-4 py-1 bg-transparent dark:bg-transparent"
    @page="onPageChange($event)" />
</template>

<script setup lang="ts">
import type { IPagination, TPaginationLimit } from '~/models/Global.model'

interface IEmits {
  page: [pagination: IPagination]
}

const emits = defineEmits<IEmits>()

const pagination = defineModel<IPagination>({
  default: {
    page: 1,
    limit: 20,
    totalPage: 1,
    count: 0,
    totalRecords: 0
  }
})

function onPageChange (event: { page: number, rows: number }): void {
  pagination.value.page = event.page + 1
  pagination.value.limit = event.rows as TPaginationLimit
  emits('page', pagination.value)
}
</script>
