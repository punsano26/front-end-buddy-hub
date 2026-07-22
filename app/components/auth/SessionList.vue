<template>
  <div class="flex flex-col gap-6 w-full">
    <!-- Header info / Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-50/50 dark:bg-surface-900/30 border border-surface-200/50 dark:border-surface-800/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
          <i class="pi pi-shield text-lg animate-pulse" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-50">
            ความปลอดภัยของเซสชัน
          </h4>
          <p class="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            เซสชันที่ใช้งานอยู่ทั้งหมดในอุปกรณ์ต่างๆ ของคุณ
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-surface-500 dark:text-surface-400">
          เซสชันทั้งหมด:
        </span>
        <span class="px-2 py-0.5 bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-xs font-bold rounded-full">
          {{ total ?? sessions.length }}
        </span>
      </div>
    </div>

    <!-- Active Sessions List -->
    <div class="flex flex-col gap-4">
      <div
        v-for="session in sortedSessions"
        :key="session.id"
        class="group relative overflow-hidden bg-white/70 dark:bg-surface-900/60 border border-surface-200/65 dark:border-surface-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary-500/35 dark:hover:border-primary-500/30 backdrop-blur-md">
        <!-- Glowing subtle line for current session -->
        <div
          v-if="session.isCurrent"
          class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-emerald-600" />
        <div
          v-else
          class="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-primary-500/30 transition-colors" />

        <!-- Left side: Icon and Session Detail -->
        <div class="flex items-start sm:items-center gap-4">
          <!-- Device Type Icon Wrapper -->
          <div
            :class="[
              session.isCurrent
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200/50 dark:border-surface-700/50'
            ]"
            class="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-xl shadow-xs transition-transform duration-300 group-hover:scale-105">
            <i :class="getDeviceIcon(session.deviceType)" />
          </div>

          <!-- Session Metadata -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm sm:text-base font-semibold text-surface-900 dark:text-surface-50">
                {{ session.deviceName || 'อุปกรณ์ไม่ทราบชื่อ' }}
              </span>

              <!-- Current session badge -->
              <span
                v-if="session.isCurrent"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-[10px] sm:text-xs font-bold rounded-full">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                เซสชันปัจจุบัน
              </span>
            </div>

            <!-- IP and Time Details -->
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-500 dark:text-surface-400 font-medium">
              <span class="flex items-center gap-1">
                <i class="pi pi-map-marker text-[10px]" />
                IP: {{ session.ipAddress || 'ไม่ทราบที่อยู่ IP' }}
              </span>
              <span class="hidden sm:inline text-surface-300 dark:text-surface-700">•</span>
              <span class="flex items-center gap-1">
                <i class="pi pi-clock text-[10px]" />
                {{ session.isCurrent ? 'กำลังใช้งานในขณะนี้' : `ใช้งานล่าสุด ${getRelativeTime(session.lastUsedAt)}` }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right side: Action Button -->
        <div class="flex items-center self-end sm:self-auto shrink-0">
          <Button
            v-if="!session.isCurrent"
            icon="pi pi-sign-out"
            label="ออกจากระบบ"
            pt:root:class="rounded-xl px-3.5 py-2 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-none transition-colors duration-200"
            @click="emit('revoke', session)" />
        </div>
      </div>
    </div>

    <!-- Actions / Logout Others at Bottom -->
    <div
      v-if="hasOtherSessions"
      class="flex justify-center sm:justify-end mt-4">
      <Button
        icon="pi pi-power-off"
        label="ออกจากระบบจากอุปกรณ์อื่นทั้งหมด"
        pt:root:class="w-full sm:w-auto rounded-xl px-5 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md border-none transition-all duration-200 active:scale-98"
        @click="emit('revokeAllOthers')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import 'dayjs/locale/th'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ISessionDataList } from '~/models/response/AuthRes.model'
import Button from '~/volt/Button.vue'

dayjs.extend(relativeTime)
dayjs.locale('th')

const props = defineProps<{
  sessions: ISessionDataList[]
  total?: number
}>()

const emit = defineEmits<{
  (e: 'revoke', session: ISessionDataList): void
  (e: 'revokeAllOthers'): void
}>()

// Helper to determine the device icon based on device type
const getDeviceIcon = (deviceType: ISessionDataList['deviceType']): string => {
  switch (deviceType) {
    case 'MOBILE':
      return 'pi pi-mobile'
    case 'TABLET':
      return 'pi pi-tablet'
    case 'DESKTOP':
      return 'pi pi-desktop'
    default:
      return 'pi pi-question-circle'
  }
}

// Format the date to Thai relative time
const getRelativeTime = (dateString: string): string => {
  if (!dateString) return ''
  return dayjs(dateString).fromNow()
}

// Sort sessions so the current session is always at the top, then by last used time
const sortedSessions = computed((): ISessionDataList[] => {
  return [...props.sessions].sort((a: ISessionDataList, b: ISessionDataList): number => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
  })
})

// Check if there are other sessions that can be revoked
const hasOtherSessions = computed((): boolean => {
  return props.sessions.some((session: ISessionDataList): boolean => !session.isCurrent)
})
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
