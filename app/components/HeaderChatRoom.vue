<template>
  <Card pt:root:class="w-full rounded-none">
    <template #content>
      <div class="flex items-center justify-between">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center gap-4">
          <ButtonBack
            :to="{ name: 'public-chat' }"
            icon="mdi:arrow-left" />
          <img
            :src="item.profileImg || '/png/upload-profile.png'"
            alt="Alice"
            class="w-10 h-10 rounded-sm object-cover">
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              {{ item.nickname || item.username }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              Online
            </p>
          </div>
        </div>
        <DotMenu />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { IUserProvider } from '~/resource/provider/User.provider'
import UserProvider from '~/resource/provider/User.provider'

const items = ref<IFindOneCurrentUserData[]>([])
const { $handleLoading } = useNuxtApp()
const id = computed((): number => Number(useRoute().params.id))
const userService: IUserProvider = new UserProvider()
async function useFetchDetails (): Promise<void> {
  const response = await userService.findOneUserById(id.value)
  items.value = response?.data ? [response.data] : []
}

function fetch (): void {
  $handleLoading(useFetchDetails)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
