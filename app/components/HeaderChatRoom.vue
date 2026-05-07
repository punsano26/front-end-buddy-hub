<template>
  <Card
    pt:body:class="px-3 md:px-5 lg:px-8 xl:px-10 py-2.5 md:py-3"
    pt:root:class="w-full rounded-none border-b border-surface-200 dark:border-surface-700 pt-[env(safe-area-inset-top)]">
    <template #content>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <ButtonBack
            :to="{ name: 'public-chat' }"
            icon="mdi:arrow-left" />
          <NuxtLink
            :to="{ name: 'public-profile-id', params: { id: user?.id } }"
            class="shrink-0">
            <img
              :src="user?.profileImg ? imageBaseUrl + user.profileImg : '/png/upload-profile.png'"
              class="w-9 h-9 md:w-10 md:h-10 rounded-lg object-cover">
          </NuxtLink>
          <div class="min-w-0 leading-tight">
            <p class="font-semibold text-sm md:text-base truncate">
              {{ user?.nickname || user?.username }}
            </p>
            <p
              v-if="user?.isOnline"
              class="text-xs text-green-500 flex items-center gap-1">
              <span class="h-2 w-2 bg-green-500 rounded-full" />
              Online
            </p>
            <p
              v-else
              class="text-xs text-surface-500 truncate">
              ใช้งานเมื่อ {{ dayjs(user?.lastOnlineAt).fromNow() }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <DotMenu :items="labelMenu" />
        </div>
        <ReportModalDialog v-model:visible="isReportDialogVisible" />
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

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

const items = ref<IFindOneCurrentUserData[]>([])
const user = computed((): IFindOneCurrentUserData | undefined => items.value[0])
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
const isReportDialogVisible = ref(false)
const labelMenu = computed((): IItems[] => {
  return [
    {
      label: 'รายงานผู้ใช้',
      icon: 'pi pi-flag',
      command: (): void => {
        isReportDialogVisible.value = true
      }
    }
  ]
})
</script>

<style scoped>

</style>
