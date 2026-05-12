<template>
  <Button
    class="p-0 text-surface-700 dark:text-surface-300"
    icon="pi pi-bell"
    pt:root:class="w-auto h-auto"
    text
    @click="toggle" />

  <Popover ref="op">
    <div class="flex justify-between mb-3">
      <div class="grid grid-cols-2 gap-2 items-center">
        <p class="text-sm font-bold text-surface-900 dark:text-surface-100">
          Notifications
        </p>
        <p class="text-xs text-surface-500 dark:text-surface-400">
          {{ items.length }}
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <Button
          pt:root:class="w-auto whitespace-nowrap"
          size="small"
          text
          @click="handleMarkAllRead">
          Mark all read
        </Button>
      </div>
    </div>

    <div class="w-[18rem] sm:w-72 md:w-80 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto">
      <Card
        pt:body:class="p-2"
        pt:root:class="border-t border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700">
        <template #content>
          <div class="flex items-center gap-2 rounded-md">
            <Avatar
              class="shrink-0"
              image="/png/logo-buddy-hub.png"
              pt:image:class="object-cover"
              size="medium" />
            <div class="min-w-0">
              <p class="text-sm text-surface-900 dark:text-surface-100 break-words">
                แจ้งเตือนจากระบบ: ระบบจะมีการบำรุงรักษาในวันพรุ่งนี้ เวลา 02:00 - 04:00 น. กรุณาเตรียมตัวล่วงหน้า
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400">
                5 วันที่แล้ว
              </p>
            </div>
          </div>
        </template>
      </Card>

      <div
        v-for="(item, index) in items"
        :key="index">
        <Card
          :pt:root:class="item.isRead
            ? 'mt-2 border-t border-surface-200 dark:border-surface-700 bg-surface-50/60 dark:bg-surface-800/30 hover:bg-surface-100 dark:hover:bg-surface-700'
            : 'mt-2 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900/60 hover:bg-surface-100 dark:hover:bg-surface-700'"
          class="cursor-pointer"
          pt:body:class="p-2"
          @click="handleMarkNotification(item)">
          <template #content>
            <div class="flex items-center gap-2 rounded-md">
              <Avatar
                class="shrink-0"
                image="/png/upload-profile.png"
                pt:image:class="object-cover"
                size="medium" />
              <div class="min-w-0">
                <p
                  :class="item.isRead
                    ? 'text-sm text-surface-700 dark:text-surface-300 break-words'
                    : 'text-sm text-surface-900 dark:text-surface-100 font-semibold break-words'">
                  {{ item.content }}
                </p>
                <p class="text-xs text-surface-500 dark:text-surface-400">
                  {{ dayjs(item.createdAt).fromNow() }}
                </p>
              </div>
              <div class="flex gap-1 ">
                <template v-if="item.requestStatus === FriendRequestStatusEnum.PENDING">
                  <Button
                    pt:root:class="w-auto whitespace-nowrap"
                    size="small"
                    text
                    @click.stop="handleAccept(item.requesterId)">
                    <i class="pi pi-check" />
                  </Button>
                  <Button
                    pt:root:class="w-auto whitespace-nowrap"
                    size="small"
                    text
                    @click.stop="handleReject(item.requesterId)">
                    <i class="pi pi-times" />
                  </Button>
                </template>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import type { INotificationList } from '~/models/response/NotificationRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'
import type { INotificationProvider } from '~/resource/provider/Notification.provider'
import NotificationProvider from '~/resource/provider/Notification.provider'

const op = ref()
const toggle = (event: Event): void => {
  op.value.toggle(event)
}
const notificationService: INotificationProvider = new NotificationProvider()
const friendService: IFriendProvider = new FriendProvider()
const { pagination, extractPagination } = usePagination()
const items = ref<INotificationList[]>([])
// const friendIds = computed((): void => items.value.map((item): number => item.friendId))
const { $handleLoading } = useNuxtApp()

async function useFetch (): Promise<void> {
  const response = await notificationService.findAllNotificationPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  })

  items.value = response?.data || []
  pagination.value = extractPagination(response?.pagination)
}

function fetch (): void {
  $handleLoading(useFetch)
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

async function useMarkAllRead (): Promise<void> {
  if (!items.value.length) return
  const response = await notificationService.markAllNotificationsAsRead()

  if (response?.data?.length) {
    items.value = response.data
  } else {
    items.value = items.value.map((item: INotificationList): INotificationList => ({
      ...item,
      isRead: true
    }))
  }

  if (response?.pagination) {
    pagination.value = extractPagination(response.pagination)
  }
}

function handleMarkAllRead (): void {
  $handleLoading(useMarkAllRead)
}

async function useMarkNotificationAsRead (item: INotificationList): Promise<void> {
  if (item.isRead) return
  const response = await notificationService.markNotificationAsRead(item.id)

  if (response?.data) {
    const index = items.value.findIndex((current: INotificationList): boolean => current.id === response.data.id)

    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        ...response.data
      }
    }
  } else {
    item.isRead = true
  }
}

function handleMarkNotification (item: INotificationList): void {
  if (item.isRead) return
  $handleLoading((): Promise<void> => useMarkNotificationAsRead(item))
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
