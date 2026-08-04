<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-surface-900 dark:text-surface-0">
    <div class="w-full max-w-md p-6 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center">
      <div class="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500">
        <svg
          class="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400">
        บัญชีของคุณถูกระงับการใช้งาน
      </h1>

      <p class="text-sm text-surface-600 dark:text-surface-300">
        บัญชีผู้ใช้งานนี้ถูกระงับเนื่องจากการละเมิดนโยบายหรือข้อกำหนดในการให้บริการ
      </p>

      <div class="w-full p-4 rounded-xl bg-surface-100 dark:bg-surface-800 flex flex-col gap-3 text-left text-sm">
        <div>
          <span class="font-semibold text-surface-700 dark:text-surface-200">สาเหตุ: </span>
          <span class="text-surface-900 dark:text-surface-0 font-medium">
            {{ reason }}
          </span>
        </div>

        <div>
          <span class="font-semibold text-surface-700 dark:text-surface-200">ระยะเวลา / วันหมดอายุ: </span>
          <span class="text-surface-900 dark:text-surface-0 font-medium">
            {{ formattedExpiresAt }}
          </span>
        </div>
      </div>

      <div class="w-full mt-4 flex flex-col gap-2">
        <Button
          label="เข้าสู่ระบบอีกครั้ง"
          pt:root:class="w-full bg-gradient-primary border-none text-white font-bold py-3 rounded-xl"
          @click="goToLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'
import { useBanStore } from '~/stores/Ban'

definePageMeta({
  layout: false,
  title: 'บัญชีถูกระงับการใช้งาน'
})

const route = useRoute()
const router = useRouter()
const banStore = useBanStore()

const reason = computed((): string => {
  if (route.query.reason) return String(route.query.reason)
  if (banStore.banInfo?.reason) return banStore.banInfo.reason
  return banStore.banMessage || 'ไม่ระบุเหตุผล'
})

const formattedExpiresAt = computed((): string => {
  const expiresAt = route.query.expiresAt || banStore.banInfo?.expiresAt
  const banDuration = route.query.banDuration || banStore.banInfo?.banDuration

  if (banDuration === 'PERMANENT' || !expiresAt) {
    return 'ถาวร (PERMANENT)'
  }

  try {
    const date = new Date(String(expiresAt))
    if (isNaN(date.getTime())) return String(expiresAt)
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return String(expiresAt)
  }
})

function goToLogin (): void {
  void router.push({ name: 'auth-login' })
}
</script>

<style scoped>
</style>
