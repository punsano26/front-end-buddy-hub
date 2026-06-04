<template>
  <header
    class="relative w-full shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 pt-[calc(env(safe-area-inset-top)+0.6rem)] pb-3 px-4 md:px-6 transition-colors duration-250">
    <!-- Brand subtle accent border bottom line -->
    <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-primary opacity-60" />

    <div class="flex items-center justify-between gap-3 mx-auto max-w-7xl">
      <div class="flex items-center gap-3 min-w-0">
        <ButtonBack
          :to="{ name: 'public-chat' }"
          class="shrink-0 transition-transform active:scale-95 text-slate-600 dark:text-slate-300"
          icon="mdi:arrow-left" />

        <NuxtLink
          :to="{ name: 'public-profile-id', params: { id: user?.id } }"
          class="relative shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95">
          <img
            :src="user?.profileImg ? imageBaseUrl + user.profileImg : '/png/upload-profile.png'"
            alt="Profile Image"
            class="w-10 h-10 rounded-xl object-cover border border-slate-200/60 dark:border-slate-800 shadow-sm">
          <span
            v-if="user?.isOnline"
            class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
        </NuxtLink>

        <div class="min-w-0 leading-tight">
          <p class="font-bold text-slate-850 dark:text-slate-50 text-sm md:text-base truncate">
            {{ user?.nickname || user?.username }}
          </p>
          <p
            v-if="user?.isOnline"
            class="text-[11px] font-semibold text-green-500 flex items-center gap-1.5 mt-0.5">
            <span class="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            Online
          </p>
          <p
            v-else
            class="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
            ใช้งานเมื่อ {{ dayjs(user?.lastOnlineAt).fromNow() }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <DotMenu
          :items="labelMenu"
          class="transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" />
      </div>

      <ReportModalDialog v-model:visible="isReportDialogVisible" />
    </div>
  </header>
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
