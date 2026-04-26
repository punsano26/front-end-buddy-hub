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
          text>
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
          pt:body:class="p-2"
          pt:root:class="mt-2 border-t border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700">
          <template #content>
            <div class="flex items-center gap-2 rounded-md">
              <Avatar
                class="shrink-0"
                image="/png/upload-profile.png"
                pt:image:class="object-cover"
                size="medium" />
              <div class="min-w-0">
                <p class="text-sm text-surface-900 dark:text-surface-100 break-words">
                  {{ item.content }}
                </p>
                <p class="text-xs text-surface-500 dark:text-surface-400">
                  {{ dayjs(item.createdAt).fromNow() }}
                </p>
              </div>
              <div class="flex gap-1 ">
                <template v-if="item.friendRequestStatus === FriendRequestStatusEnum.PENDING">
                  <Button
                    pt:root:class="w-auto whitespace-nowrap"
                    size="small"
                    text
                    @click="handleAccept(item.id)">
                    <i class="pi pi-check" />
                  </Button>
                  <Button
                    pt:root:class="w-auto whitespace-nowrap"
                    size="small"
                    text
                    @click="handleReject(item.id)">
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
const { $handleLoading } = useNuxtApp()

async function useFetch (): Promise<void> {
  const response = await notificationService.findAllNotificationPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
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

async function handleAccept (id: number): Promise<void> {
  await friendService.acceptFriendRequest(id)
  fetch()
}

async function handleReject (id: number): Promise<void> {
  await friendService.rejectFriendRequest(id)
  fetch()
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
