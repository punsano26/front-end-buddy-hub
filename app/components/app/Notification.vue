<template>
  <button
    class="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
    @click="toggle">
    <i class="pi pi-bell text-xl text-surface-700 dark:text-surface-300 transition-transform hover:scale-110" />

    <span
      v-if="notificationStore.unreadCount > 0"
      class="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-surface-950">
      {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
    </span>
  </button>

  <Popover
    ref="op"
    pt:content:class="p-0"
    pt:root:class="rounded-2xl shadow-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
    <div class="w-88 sm:w-104 max-w-[calc(100vw-2rem)] flex flex-col bg-white dark:bg-surface-900">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3.5 border-b border-surface-100 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="flex items-center gap-2.5">
          <h3 class="text-base font-semibold text-surface-900 dark:text-surface-100 tracking-tight">
            Notifications
          </h3>
          <span
            v-if="notificationStore.unreadCount > 0"
            class="flex h-5 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/40 px-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
            {{ notificationStore.unreadCount }} new
          </span>
        </div>
        <Button
          pt:root:class="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
          text
          @click="handleMarkAllRead">
          Mark all as read
        </Button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-2 flex flex-col gap-1">
        <div class="group relative flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/50 border border-transparent">
          <button
            aria-label="Open user profile"
            class="shrink-0 ring-2 ring-surface-100 dark:ring-surface-800 shadow-sm rounded-full cursor-pointer"
            type="button"
            @click="onClickUserDetail(notificationStore.systemNotification?.userId)">
            <Avatar
              image="/png/logo-buddy-hub.png"
              pt:image:class="object-cover"
              shape="circle"
              size="large" />
          </button>
          <div class="flex-1 min-w-0 flex flex-col gap-1 mt-0.5">
            <p class="text-[13px] font-medium text-surface-900 dark:text-surface-100 leading-snug wrap-break-word">
              แจ้งเตือนจากระบบ: ระบบจะมีการบำรุงรักษาในวันพรุ่งนี้ เวลา 02:00 - 04:00 น. กรุณาเตรียมตัวล่วงหน้า
            </p>
            <span class="text-[11px] font-medium text-surface-400 dark:text-surface-500">
              5 วันที่แล้ว
            </span>
          </div>
        </div>

        <div
          v-for="(item, index) in notificationStore.items"
          :key="index"
          :class="item.isRead
            ? 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
            : 'bg-primary-50/40 dark:bg-primary-900/10 hover:bg-primary-50/80 dark:hover:bg-primary-900/20'"
          class="group relative flex items-start gap-3.5 rounded-xl p-3 transition-all duration-200 cursor-pointer border border-transparent"
          @click="handleMarkNotification(item)">
          <div
            v-if="!item.isRead"
            class="absolute top-1/2 left-1 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary-500 shadow-[0_0_6px_rgba(var(--color-primary-500),0.6)]" />

          <button
            aria-label="Open user profile"
            class="shrink-0 rounded-full cursor-pointer focus:outline-none"
            type="button"
            @click.stop="onClickUserDetail(item.requesterId)">
            <Avatar
              :alt="item?.userId || 'Notification Avatar'"
              :class="item.isRead ? 'ring-surface-100 dark:ring-surface-800 group-hover:ring-surface-200 dark:group-hover:ring-surface-700' : 'ring-primary-100 dark:ring-primary-900/50'"
              :image="resolveAvatar(item?.requesterProfileImg)"
              class="shrink-0 ring-2 shadow-sm transition-all duration-200"
              pt:image:class="object-cover"
              shape="circle"
              size="large" />
          </button>

          <div class="flex-1 min-w-0 flex flex-col gap-1 mt-0.5">
            <p
              :class="item.isRead
                ? 'text-surface-600 dark:text-surface-400'
                : 'text-surface-900 dark:text-surface-100 font-semibold'"
              class="text-[13px] leading-snug wrap-break-word">
              {{ item.content }}
            </p>
            <span
              :class="item.isRead ? 'text-surface-400 dark:text-surface-500' : 'text-primary-600/80 dark:text-primary-400/80'"
              class="text-[11px] font-medium transition-colors">
              {{ dayjs(item.createdAt).fromNow() }}
            </span>
          </div>

          <div
            v-if="item.requestStatus === FriendRequestStatusEnum.PENDING"
            class="flex items-center gap-1.5 shrink-0 ml-1 mt-1">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20 transition-colors shadow-sm"
              title="Accept"
              @click.stop="handleAccept(item.requesterId)">
              <i class="pi pi-check text-sm font-bold" />
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors shadow-sm"
              title="Reject"
              @click.stop="handleReject(item.requesterId)">
              <i class="pi pi-times text-sm font-bold" />
            </button>
          </div>
          <div @click.stop>
            <DotMenu :items="getNotificationItems(item)" />
          </div>
        </div>

        <div
          v-if="notificationStore.items.length === 0"
          class="flex flex-col items-center justify-center py-10 text-center px-4">
          <div class="h-14 w-14 rounded-full bg-surface-50 dark:bg-surface-800/50 flex items-center justify-center mb-4">
            <i class="pi pi-bell-slash text-2xl text-surface-400 dark:text-surface-500" />
          </div>
          <p class="text-[15px] font-semibold text-surface-900 dark:text-surface-100">
            No notifications yet
          </p>
          <p class="text-[13px] text-surface-500 dark:text-surface-400 mt-1.5">
            When you get notifications, they'll show up here
          </p>
        </div>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import type { IItems } from '~/models/Global.model'
import type { INotificationList } from '~/models/response/NotificationRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'
import { useNotificationStore } from '~/stores/Notification'

const op = ref()
const toggle = (event: Event): void => {
  op.value.toggle(event)
}
const router = useRouter()
const friendService: IFriendProvider = new FriendProvider()
const notificationStore = useNotificationStore()
const { $handleLoading } = useNuxtApp()
const imageBase = String(import.meta.env.VITE_ENV_BASE_FILE_URL || '').replace(/\/$/, '')
function fetch (): void {
  $handleLoading((): Promise<void> => notificationStore.fetchNotifications())
}

onMounted((): void => {
  fetch()
})

async function handleAccept (requesterId: number | null): Promise<void> {
  if (requesterId === null) return
  await friendService.acceptFriendRequest(requesterId)
  fetch()
}

async function handleReject (requesterId: number | null): Promise<void> {
  if (requesterId === null) return
  await friendService.rejectFriendRequest(requesterId)
  fetch()
}

function handleMarkAllRead (): void {
  $handleLoading((): Promise<void> => notificationStore.markAllAsRead())
}

function handleMarkNotification (item: INotificationList): void {
  if (item.isRead) return
  $handleLoading((): Promise<void> => notificationStore.markAsRead(item.id))
}

function getNotificationItems (item: INotificationList): IItems[] {
  const items: IItems[] = []
  if (!item.isRead) {
    items.push({
      label: 'ทำเครื่องหมายอ่านแล้ว',
      command: (): void => {
        void handleMarkNotification(item)
      }
    })
  }
  items.push({
    label: 'ลบการแจ้งเตือน',
    command: (): void => {
      void handleDeleteNotification(item.id)
    }
  })
  return items
}

async function handleDeleteNotification (id: number): Promise<void> {
  await notificationStore.deleteNotification(id)
}

function resolveAvatar (path?: string | null): string {
  if (!path) return '/png/upload-profile.png'
  if ((/^https?:\/\//i).test(path)) return path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return imageBase ? `${imageBase}${normalizedPath}` : normalizedPath
}

function onClickUserDetail (userId?: number | null): void {
  if (!userId || userId <= 0) return
  router.push({ name: 'public-profile-id', params: { id: userId } })
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}


.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
