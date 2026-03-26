<template>
  <Paginator
    :rows="pagination.limit"
    :total-records="pagination.totalRecords"
    pt:root:class="justify-end px-4 py-1"
    @page="onPageChange($event)">
    <template #container>
      <div class="flex gap-2 items-center">
        <SecondaryButton
          :disabled="pagination.page <= 1"
          class="border size-8!"
          variant="outlined"
          @click="onPrevPage()">
          <template #icon>
            <AngleLeftIcon />
          </template>
        </SecondaryButton>
        <span class="text-sm text-surface-300">
          {{ pagination.page }} / {{ pagination.totalPage }} หน้า /
          {{ pagination.totalRecords }} สมาชิก
        </span>
        <SecondaryButton
          :disabled="pagination.page === pagination.totalPage"
          class="border size-8!"
          variant="outlined"
          @click="onNextPage()">
          <template #icon>
            <AngleRightIcon />
          </template>
        </SecondaryButton>
      </div>
    </template>
  </Paginator>
</template>

<script setup lang="ts">
import AngleLeftIcon from '@primevue/icons/angleleft'
import AngleRightIcon from '@primevue/icons/angleright'
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
function onPrevPage (): void {
  if (pagination.value.page <= 1) return
  pagination.value.page--
  emits('page', pagination.value)
}
function onNextPage (): void {
  if (pagination.value.page === pagination.value.totalPage) return
  pagination.value.page++
  emits('page', pagination.value)
}
</script>
