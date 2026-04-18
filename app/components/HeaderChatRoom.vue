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
          <NuxtLink
            :to="{ name: 'public-profile-id', params: { id: item.id } }">
            <img
              :src="item.profileImg || '/png/upload-profile.png'"
              alt="Alice"
              class="w-10 h-10 rounded-sm object-cover">
          </NuxtLink>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              {{ item.nickname || item.username }}
            </p>
            <p
              v-if="item.isOnline"
              class="text-xs text-green-500 flex items-center gap-1">
              <span class="h-2 w-2 bg-green-500 rounded-full" />
              Online
            </p>
            <p
              v-else
              class="text-xs text-gray-500">
              ใช้งานเมื่อ {{ dayjs(item.lastOnlineAt).fromNow() }}
            </p>
          </div>
        </div>
        <DotMenu :items="labelMenu" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import 'dayjs/locale/th'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { IItems } from '~/models/Global.model'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { IUserProvider } from '~/resource/provider/User.provider'
import UserProvider from '~/resource/provider/User.provider'

dayjs.extend(relativeTime)
dayjs.locale('th')

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

const labelMenu = computed((): IItems[] => {
  return [
    {
      label: 'รายงานผู้ใช้',
      icon: 'pi pi-flag',
      command: (): void => {
        console.log('hello')
      }
    }
  ]
})
</script>

<style scoped>

</style>
