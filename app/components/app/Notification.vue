<template>
  <Button
    class="p-0 text-surface-700 dark:text-surface-300"
    icon="pi pi-bell"
    pt:root:class="w-auto h-auto"
    text
    @click="toggle" />

  <Popover ref="op">
    <div class="flex justify-between">
      <div class="grid grid-cols-2 gap-2 items-center">
        <p class="text-sm font-bold text-surface-900 dark:text-surface-100">
          Notifications
        </p>
        <p class="text-xs text-surface-500 dark:text-surface-400">
          3 new
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
    <div class="w-[18rem] sm:w-72 md:w-80 max-w-[calc(100vw-2rem)]">
      <Card
        pt:body:class="p-2"
        pt:root:class="mt-2 border-t border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700">
        <template #content>
          <div class="flex items-center gap-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700">
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
                5 minutes ago
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
            <div

              class="flex items-center gap-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700">
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
                  {{ item.createdAt }}
                </p>
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
import type { INotificationList } from '~/models/response/NotificationRes.model'
import type { INotificationProvider } from '~/resource/provider/Notification.provider'
import NotificationProvider from '~/resource/provider/Notification.provider'

const op = ref()
const toggle = (event: Event): void => {
  op.value.toggle(event)
}
const notificationService: INotificationProvider = new NotificationProvider()
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
</script>

<style scoped>

</style>
