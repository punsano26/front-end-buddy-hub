<template>
  <div class="flex flex-col gap-6 relative transition-colors duration-250 p-4 max-w-7xl mx-auto w-full">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-4 items-center">
        <ButtonBack
          use-history-fallback
          icon="prime:chevron-left"
          label=""
          class="hover:scale-[1.02] transition-transform duration-200 text-surface-900 dark:text-surface-0" />
        <div class="flex flex-col">
          <h1 class="text-xl font-extrabold text-sky-500 dark:text-sky-400">แดชบอร์ดรายได้</h1>
          <p class="text-sm text-surface-500 dark:text-surface-400">ติดตามรายได้ สถิติ และถอนเงินเข้าบัญชีธนาคาร</p>
        </div>
      </div>
      <Button
        label="ถอนเงิน"
        pt:root:class="bg-surface-200 dark:bg-surface-800 border-none rounded-xl text-surface-500 dark:text-surface-400 font-semibold hover:bg-surface-300 dark:hover:bg-surface-700 transition-all duration-200 px-4 py-2 flex items-center gap-2 cursor-pointer"
        @click="handleWithdrawClick">
        <template #icon>
          <Icon name="lucide:download" class="text-base" />
        </template>
      </Button>
    </div>

    <!-- Maintenance Notice Banner -->
    <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
          <Icon name="ph:wrench-fill" class="text-lg" />
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span class="text-xs font-bold text-amber-900 dark:text-amber-200">แจ้งเตือนระบบ:</span>
          <span class="text-xs font-medium text-amber-800 dark:text-amber-300">ระบบการถอนเงินอยู่ในช่วงปรับปรุง ขออภัยในความไม่สะดวก </span>
        </div>
      </div>
      <div class="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-700 dark:text-amber-300 flex-shrink-0">
        <Icon name="ph:clock-countdown-bold" class="text-xs" />
        <span>กำลังปรับปรุง</span>
      </div>
    </div>

    <!-- Quick Stats Grid (Mobile-first) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Today's Revenue -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 border-t-2 border-t-emerald-500 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">รายได้วันนี้</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ stats?.todayRevenue ?? 1260 }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">เหรียญ</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <Icon name="ph:coins-fill" class="text-2xl text-emerald-500" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Revenue -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 border-t-2 border-t-cyan-500 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">รายได้รวม</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ (stats?.totalRevenue ?? 17835).toLocaleString() }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">เหรียญสะสมทั้งหมด</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 flex items-center justify-center">
              <Icon name="ph:chart-line-up-bold" class="text-2xl text-cyan-500" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Service Hours -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 border-t-2 border-t-purple-500 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">นาทีที่ให้บริการ</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ (stats?.serviceDurationMinutes ?? 3060).toLocaleString() }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">{{ formatDuration(stats?.serviceDurationMinutes ?? 3060) }}</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <Icon name="ph:clock-bold" class="text-2xl text-purple-500" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Average Rating -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 border-t-2 border-t-amber-500 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">คะแนนเฉลี่ย</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ stats?.averageRating?.toFixed(2) ?? '4.80' }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">{{ stats?.reviewCount ?? 32 }} รีวิว</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <Icon name="ph:star-fill" class="text-2xl text-amber-500" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Revenue Statistics Chart -->
    <Card pt:root:class="bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm">
      <template #content>
        <ClientOnly>
          <PaymentEarningsChart :trends="stats?.revenueTrends ?? []" />
        </ClientOnly>
      </template>
    </Card>

    <!-- Withdrawal Section (Mobile-first Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Withdrawable Balance & Banker Account -->
      <Card pt:root:class="lg:col-span-1 bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex flex-col gap-4">
            <!-- Header Balance -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-emerald-500 dark:text-emerald-400">
                <Icon name="ph:wallet-fill" class="text-xl" />
                <p class="text-sm font-bold">ยอดถอนได้</p>
              </div>
              <div class="flex flex-col">
                <p class="text-4xl font-extrabold text-surface-900 dark:text-surface-0">{{ withdrawableBalance.toLocaleString() }}</p>
                <p class="text-xs text-surface-500 dark:text-surface-400 font-medium mt-0.5">เหรียญ · ≈ ฿{{ withdrawableBalance.toLocaleString() }}</p>
              </div>
              <div class="flex items-center gap-1.5 text-amber-500 mt-2 font-medium">
                <Icon name="ph:hourglass-medium-fill" class="text-xs animate-pulse" />
                <p class="text-[11px]">รอดำเนินการ 800 เหรียญ</p>
              </div>
            </div>

            <Divider pt:root:class="my-2 border-surface-200 dark:border-surface-800" />

            <!-- Bank Account Binding -->
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 text-surface-800 dark:text-surface-200">
                  <Icon name="ph:bank-fill" class="text-lg text-surface-600 dark:text-surface-400" />
                  <p class="text-sm font-semibold">บัญชีรับเงิน</p>
                </div>
                <button
                  @click="visible = true"
                  class="cursor-pointer flex items-center gap-1 text-xs font-semibold text-surface-600 dark:text-surface-300 hover:text-primary transition-colors duration-200 animate-fade-in"
                  type="button">
                  <span>ผูกบัญชี</span>
                  <Icon name="ph:pencil-simple-bold" class="text-sm" />
                </button>
              </div>

              <!-- Dynamic Banker Account UI -->
              <div v-if="bankerInfo" class="p-3 rounded-xl bg-surface-50 dark:bg-surface-950/60 border border-surface-200 dark:border-surface-800 flex flex-col gap-0.5 shadow-inner">
                <p class="text-sm font-bold text-surface-900 dark:text-surface-0">{{ bankerInfo.bankName }}</p>
                <p class="text-xs text-surface-500 dark:text-surface-400">
                  •••• {{ bankerInfo.accountNumber.slice(-4) }} · {{ bankerInfo.accountName }}
                </p>
              </div>
              <div v-else class="text-xs text-surface-400 dark:text-surface-500 font-medium py-3 text-center bg-surface-50/50 dark:bg-surface-950/30 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
                ยังไม่ได้ผูกบัญชี
              </div>
            </div>

            <!-- Notice: Maintenance -->
            <div class="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
              <Icon name="ph:warning-circle-fill" class="text-base flex-shrink-0 text-amber-500 mt-0.5" />
              <p class="text-xs font-medium leading-relaxed">
                ระบบการถอนเงินอยู่ในช่วงปรับปรุง ขออภัยในความไม่สะดวก ตัวเลขที่ท่านเห็นเป็นเพียงตัวเลขจำลองเท่านั้น ไม่สามารถถอนเงินได้จริง
              </p>
            </div>

            <!-- Withdraw Button -->
            <Button
              label="ถอนเงิน"
              pt:root:class="w-full bg-surface-200 dark:bg-surface-800 border-none rounded-xl text-surface-500 dark:text-surface-400 font-semibold py-2.5 mt-2 flex items-center justify-center gap-2 hover:bg-surface-300 dark:hover:bg-surface-700 transition-all duration-200 cursor-pointer"
              @click="handleWithdrawClick">
              <template #icon>
                <Icon name="lucide:download" class="text-base" />
              </template>
            </Button>
          </div>
        </template>
      </Card>

      <!-- Withdrawal History -->
      <Card pt:root:class="lg:col-span-2 bg-surface-0 dark:bg-surface-900/60 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-sm">
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2 text-surface-900 dark:text-surface-0">
              <Icon name="ph:history-bold" class="text-xl text-primary" />
              <p class="text-base font-bold">ประวัติการถอนเงิน</p>
            </div>
            
            <div class="flex flex-col gap-3">
              <!-- Item 1: KBANK (สำเร็จ) -->
              <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/40 border border-surface-200 dark:border-surface-800 flex justify-between items-center transition-all duration-200 hover:translate-x-0.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <Icon name="ph:bank-bold" class="text-lg text-surface-600 dark:text-surface-300" />
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <div class="flex gap-2 items-center">
                      <p class="text-sm font-bold text-surface-900 dark:text-surface-0">ธ.กสิกรไทย</p>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Icon name="ph:check-circle-fill" class="text-[10px]" />
                        <span>สำเร็จ</span>
                      </span>
                    </div>
                    <p class="text-xs text-surface-500 dark:text-surface-400">•••• 2847 · 23 มิ.ย. 2569 20:33</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-0.5">
                  <p class="text-base font-extrabold text-surface-900 dark:text-surface-0">-1,500</p>
                  <p class="text-[10px] text-surface-500 dark:text-surface-400">เหรียญ</p>
                </div>
              </div>

              <!-- Item 2: SCB (กำลังโอน) -->
              <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-950/40 border border-surface-200 dark:border-surface-800 flex justify-between items-center transition-all duration-200 hover:translate-x-0.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                    <Icon name="ph:bank-bold" class="text-lg text-surface-600 dark:text-surface-300" />
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <div class="flex gap-2 items-center">
                      <p class="text-sm font-bold text-surface-900 dark:text-surface-0">ธ.ไทยพาณิชย์</p>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        <Icon name="ph:spinner-gap-bold" class="text-[10px] animate-spin" />
                        <span>กำลังโอน</span>
                      </span>
                    </div>
                    <p class="text-xs text-surface-500 dark:text-surface-400">•••• 1024 · 3 ก.ค. 2569 14:33</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-0.5">
                  <p class="text-base font-extrabold text-surface-900 dark:text-surface-0">-800</p>
                  <p class="text-[10px] text-surface-500 dark:text-surface-400">เหรียญ</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialogs -->
    <PaymentSetBankerDialog v-model:visible="visible" v-model:bankInfo="bankerInfo" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { IFindAllRentStatisticsData } from '~/models/response/DasboardRes.model'
import DashboardProvider from '~/resource/provider/Dashboard.provider'

const toast = useToast()
const visible = ref<boolean>(false)
const bankerInfo = ref<{ bankName: string, accountNumber: string, accountName: string } | null>(null)
const dashboardService = new DashboardProvider()
const { $handleLoading } = useNuxtApp()
const stats = ref<IFindAllRentStatisticsData | null>(null)
const isLoading = ref<boolean>(false)

const handleWithdrawClick = (): void => {
  toast.add({
    severity: 'warn',
    summary: 'แจ้งเตือนระบบ',
    detail: 'ระบบการถอนเงินอยู่ในช่วงปรับปรุง ขออภัยในความไม่สะดวก',
    life: 5000
  })
}

const fetchStats = (): void => {
  $handleLoading(
    async (): Promise<void> => {
      const response = await dashboardService.findAllRentStatistics()
      stats.value = response?.data ?? null
    },
    { loadingUnit: isLoading }
  )
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  return `${hours} ชั่วโมง`
}

const withdrawableBalance = computed((): number => {
  const base = stats.value?.totalRevenue ?? 17835
  return base - 2300
})

onMounted((): void => {
  fetchStats()
})

definePageMeta({
  layout: 'navbar',
  title: 'แดชบอร์ดรายได้'
})
</script>

<style>

</style>