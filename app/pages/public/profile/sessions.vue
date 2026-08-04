<template>
  <div class="relative w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 flex flex-col gap-8 min-h-[80vh]">
    <!-- Background premium glows -->
    <div class="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-tr from-sky-500/8 via-indigo-500/4 to-purple-500/8 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none -z-10 animate-pulse" />

    <!-- Back Navigation and Page Title -->
    <div class="flex flex-col gap-4">
      <div>
        <ButtonBack
          :to="{ name: 'public-profile' }"
          icon="prime:chevron-left"
          label="ย้อนกลับไปที่โปรไฟล์"
          class="text-xs sm:text-sm font-bold text-surface-400 dark:text-surface-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors" />
      </div>
      
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl sm:text-4xl font-black text-surface-900 dark:text-surface-50 tracking-tight">
          <span class="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            จัดการเซสชันและอุปกรณ์
          </span>
        </h1>
        <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 max-w-2xl leading-relaxed">
          ความปลอดภัยของบัญชีของคุณคือสิ่งสำคัญ ตรวจสอบรายการอุปกรณ์ที่เคยเข้าสู่ระบบ และสั่งออกจากระบบจากอุปกรณ์อื่นทั้งหมดได้ที่นี่
        </p>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="w-full bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border border-surface-200/50 dark:border-surface-800/80 rounded-3xl p-5 sm:p-8 shadow-sm">
      <DataLoadingState :is-loading="isLoading">
        <!-- Skeleton Loading State -->
        <template #skeleton>
          <div class="flex flex-col gap-5 animate-pulse">
            <div class="h-16 bg-surface-200 dark:bg-surface-800 rounded-2xl w-full" />
            <div class="h-24 bg-surface-200 dark:bg-surface-800 rounded-2xl w-full" />
            <div class="h-24 bg-surface-200 dark:bg-surface-800 rounded-2xl w-full" />
            <div class="h-24 bg-surface-200 dark:bg-surface-800 rounded-2xl w-full" />
          </div>
        </template>

        <!-- Sessions List Component -->
        <SessionList
          v-if="sessions.length > 0"
          :sessions="sessions"
          :total="pagination.total"
          @revoke="confirmRevokeSingle"
          @revokeAllOthers="confirmRevokeAllOthers" />

        <!-- Empty state (Fallback) -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
            <i class="pi pi-shield text-2xl text-surface-400" />
          </div>
          <p class="text-base font-semibold text-surface-900 dark:text-surface-50">
            ไม่พบเซสชันที่ใช้งานอยู่
          </p>
        </div>
      </DataLoadingState>
    </div>

    <div
      v-if="hasMultiplePages"
      class="flex justify-center w-full">
      <Paginate
        v-model="pagination"
        @page="loadSessions" />
    </div>

    <!-- Confirm Modal Dialogs -->
    
    <!-- Confirm Revoke Single Session (non-current) -->
    <!-- Note: Since backend only supports revoking all other sessions or the current session via refresh token, -->
    <!-- revoking a specific other device is completed via the "revoke all other sessions" action. -->
    <ConfirmModalDialog
      v-model:visible="isConfirmRevokeSingleVisible"
      confirm-button="ใช่, ออกจากระบบทั้งหมด"
      message="ระบบจะทำการออกจากระบบจากอุปกรณ์อื่นทั้งหมดเพื่อความปลอดภัยสูงสุดของคุณ"
      title="ออกจากระบบจากอุปกรณ์อื่นทั้งหมด ?"
      @confirm="handleRevokeAllOthers" />

    <!-- Confirm Revoke All Other Sessions -->
    <ConfirmModalDialog
      v-model:visible="isConfirmRevokeAllOthersVisible"
      confirm-button="ใช่, ออกจากระบบทั้งหมด"
      message="อุปกรณ์เครื่องอื่นทั้งหมดของคุณจะถูกออกจากระบบทันที โดยเซสชันปัจจุบันของคุณบนเครื่องนี้จะยังสามารถใช้งานได้ปกติ"
      title="ยืนยันการออกจากระบบอุปกรณ์อื่นทั้งหมด ?"
      @confirm="handleRevokeAllOthers" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import SessionList from '~/components/auth/SessionList.vue'
import ConfirmModalDialog from '~/components/ConfirmModalDialog.vue'
import DataLoadingState from '~/components/skeleton/DataLoadingState.vue'
import Paginate from '~/components/user/Paginate.vue'
import type { ISessionDataList } from '~/models/response/AuthRes.model'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

definePageMeta({
  layout: 'navbar'
})

useHead({
  title: 'จัดการเซสชันและอุปกรณ์',
  meta: [
    {
      name: 'description',
      content: 'จัดการและตรวจสอบประวัติเซสชันการล็อกอิน อุปกรณ์ทั้งหมดที่กำลังใช้งานบัญชีของคุณ'
    }
  ]
})

const authService: IAuthProvider = new AuthProvider()
const toast = useToast()
const { $handleLoading } = useNuxtApp()

const sessions = ref<ISessionDataList[]>([])
const isLoading = ref<boolean>(true)
const { pagination, extractPagination } = usePagination()
pagination.value.limit = 10
const isConfirmRevokeSingleVisible = ref<boolean>(false)
const isConfirmRevokeAllOthersVisible = ref<boolean>(false)

const hasMultiplePages = computed((): boolean => {
  return (pagination.value.total ?? 0) > pagination.value.limit
})

async function useFetch (): Promise<void> {
  const response = await authService.listSessions({
    page: pagination.value.page,
    limit: pagination.value.limit
  })
  sessions.value = response.data || []
  pagination.value = {
    ...extractPagination(response.pagination),
    limit: 10
  }
}

function loadSessions (): void {
  $handleLoading(useFetch, {
    loadingUnit: isLoading
  })
}

onMounted((): void => {
  loadSessions()
})

// Trigger single session revocation confirmation
function confirmRevokeSingle (session: ISessionDataList): void {
  isConfirmRevokeSingleVisible.value = true
}

// Trigger all other sessions revocation confirmation
function confirmRevokeAllOthers (): void {
  isConfirmRevokeAllOthersVisible.value = true
}

// Handle revoking all other sessions
async function executeRevokeAllOthers (): Promise<void> {
  await authService.revokeAllOtherSessions()
  pagination.value.page = 1
  await useFetch()
}

function handleRevokeAllOthers (): void {
  $handleLoading(executeRevokeAllOthers, {
    toast: {
      instance: toast,
      success: {
        detail: 'ออกจากระบบจากอุปกรณ์อื่นทั้งหมดสำเร็จ'
      }
    }
  })
}
</script>

<style scoped>
</style>
