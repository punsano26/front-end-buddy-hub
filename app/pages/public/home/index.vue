<template>
  <div>
    <Card pt:root:class="bg-gradient-to-r from-sky-950 to-cyan-950 rounded-none">
      <template #content>
       <div class="p-6 flex flex-col gap-4 justify-center items-center">
        <div class="flex gap-1">
          <p class="font-bold text-3xl text-white">ค้นหาเพื่อนรักของ</p>
          <p class="font-bold text-3xl bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">คุณ</p>
        </div>
        <p class="text-sm text-surface-300 sm:text-xl mx-auto text-center">พบกับความแปลกใหม่และสังคมใหม่ๆที่ทุกคนในนี้ต่างเฝ้ารอที่จะคุยและสนุกกับคุณ</p>
        <div class="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <InputSearch class="w-full md:w-xs max-w-lg" />
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <Badge severity="success" />
              <span class="text-white">14 ออนไลน์</span>
            </div>
            <div class="flex items-center gap-2">
              <img src="/svg/solar--user-circle-linear.svg" alt="User Icon" class="w-5 h-5" />
              <span class="text-white font-bold">1,234</span>
              <span class="text-white">สมาชิก</span>
            </div>
          </div>
        </div>
       </div>
      </template>
    </Card>
    <div class="p-4 grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4">
  <UserCard v-for="item in items" :key="item.id" :value="item" @click="visible = true"/>

</div>
<template>
    <div>
        <Paginator pt:root:class="bg-slate-950" :rows="10" :totalRecords="120" />
    </div>
</template>
<UserDetailDialog v-model:visible="visible" />
  </div>
</template>

<script setup lang="ts">
import InputSearch from '~/components/input/InputSearch.vue'
import UserCard from '~/components/user/UserCard.vue'
import UserDetailDialog from '~/components/user/UserDetailDialog.vue'
import type { IUserList } from '~/models/response/UserRes.model'
import type { IUserProvider } from '~/resource/provider/User.provider'
import UserProvider from '~/resource/provider/User.provider'
import Card from '~/volt/Card.vue'
import Paginator from '~/volt/Paginator.vue'

const visible = ref(false)
const userService: IUserProvider = new UserProvider()
const { $handleLoading } = useNuxtApp()
const { search, pagination, extractPagination } = usePagination()
definePageMeta({ layout: 'navbar' })
const items = ref<IUserList[]>([])

async function useFetch (): Promise<void> {
  const response = await userService.findAllUsersPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
    // ,search: search.value,
  })

  items.value = response?.data || []
  pagination.value = extractPagination(response)
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})


</script>

<style scoped>

</style>
