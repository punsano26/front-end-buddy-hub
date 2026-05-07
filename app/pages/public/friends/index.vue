<template>
  <div class="py-8 px-4">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div class="flex gap-4 items-center">
          <Button
          size="medium"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3">
          <i class="pi pi-user-plus" />
        </Button>
        <h2 class="text-lg font-bold">เพื่อนๆ</h2>
        <p class="text-sm text-gray-300">({{ itemsUserFriends.length }})</p>
        </div>
        <div class="w-full sm:w-auto">
          <InputSearch v-model="search"
          @search="onSearch()"/>
        </div>
      </div>
      <!-- User List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      <UserCardListFriends  
        v-for="(item, index) in itemsUserFriends"
        :key="index"
        :value="item"
      />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputSearch from '~/components/input/InputSearch.vue'
import type { IFindAllFriendList } from '~/models/response/FriendRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'

definePageMeta({ layout: "navbar" });

const itemsUserFriends = ref<IFindAllFriendList[]>([])
const { search, pagination, extractPagination } = usePagination()
const { $handleLoading } = useNuxtApp()
const friendService: IFriendProvider = new FriendProvider()

async function useFetch (): Promise<void> {
  const response = await friendService.findAllFriendPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit,
    search: search.value,
  })

  itemsUserFriends.value = Array.isArray(response?.data) ? response.data : []
  pagination.value = extractPagination(response?.pagination)
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})

function onSearch (): void {
  pagination.value.page = 1
  fetch()
}
</script>

<style scoped>

</style>