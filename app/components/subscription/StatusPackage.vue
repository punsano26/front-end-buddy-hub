<template>
  <div class="space-y-3">
    <!-- Active Subscription Card -->
    <div
      v-if="activeSubscription"
      class="flex flex-col gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-100/80 via-white to-amber-50/60 p-4 text-slate-900 shadow-sm md:flex-row md:items-center md:justify-between dark:border-amber-400/30 dark:from-amber-400/15 dark:via-white/10 dark:to-transparent dark:text-white dark:shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200">
          <i class="pi pi-crown text-base" />
        </span>
        <div>
          <p class="text-sm text-amber-700/80 dark:text-amber-100/80">
            คุณเป็นสมาชิก {{ activeSubscription.package?.name || 'VIP' }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-300">
            หมดอายุ: {{ formatDate(activeSubscription.expiresAt) }}
          </p>
        </div>
      </div>
      <button
        :disabled="isCancelling"
        class="rounded-2xl border border-amber-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 transition duration-300 hover:border-amber-300 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20 cursor-pointer disabled:opacity-50"
        type="button"
        @click="handleCancel">
        {{ isCancelling ? 'กำลังยกเลิก...' : 'ยกเลิก VIP' }}
      </button>
    </div>

    <!-- Free User Card -->
    <div
      v-else
      class="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <span class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
        <i class="pi pi-asterisk text-xs" />
      </span>
      <p>
        ตอนนี้คุณใช้แพ็กเกจ <span class="font-semibold text-slate-900 dark:text-white">ฟรี</span> · Find Match ได้ 5 ครั้ง/วัน · อัปเกรดเพื่อรับสิทธิพิเศษทันที
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import SubscriptionProvider, { type ISubscriptionProvider } from '~/resource/provider/Subscription.provider'
import type { ISubscriptionData } from '~/models/response/SubscriptionRes.model'

const subscriptionService: ISubscriptionProvider = new SubscriptionProvider()
const activeSubscription = ref<ISubscriptionData | null>(null)
const isCancelling = ref(false)

function formatDate (dateStr: string): string {
  return dayjs(dateStr).format('DD/MM/YYYY HH:mm')
}

async function fetchMySubscription (): Promise<void> {
  try {
    const res = await subscriptionService.findAllMySubscriptionsPaginate({ status: 'ACTIVE', limit: 1 })
    if (res?.data && res.data.length > 0) {
      activeSubscription.value = res.data[0]
    } else {
      activeSubscription.value = null
    }
  } catch (err: any) {
    console.error('[StatusPackage] fetchMySubscription error:', err)
  }
}

async function handleCancel (): Promise<void> {
  if (!activeSubscription.value || isCancelling.value) return
  isCancelling.value = true
  try {
    await subscriptionService.cancelSubscription(activeSubscription.value.id)
    activeSubscription.value = null
  } catch (err: any) {
    console.error('[StatusPackage] cancelSubscription error:', err)
  } finally {
    isCancelling.value = false
  }
}

onMounted((): void => {
  fetchMySubscription()
})
</script>
