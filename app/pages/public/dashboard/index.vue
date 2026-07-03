<template>
  <div class="flex flex-col gap-6 relative transition-colors duration-250 p-4">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-4 items-center">
        <ButtonBack
          use-history-fallback
          icon="prime:chevron-left"
          label=""
          class="hover:scale-[1.02] transition-transform duration-200" />
        <div class="flex flex-col">
          <h1 class="text-xl font-extrabold text-surface-900 dark:text-surface-0">แดชบอร์ดรายได้</h1>
          <p class="text-sm text-surface-500 dark:text-surface-400">ภาพรวมรายได้ของคุณ</p>
        </div>
      </div>
      <Button
        label="ถอนเงิน"
        icon="prime:arrow-down"
        pt:root:class="bg-gradient-primary border-none rounded-xl text-white font-semibold shadow-md shadow-indigo-500/20 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98] transition-all duration-200" />
    </div>

    <!-- Quick Stats Grid (Mobile-first) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Today's Revenue (Spotlight Card) -->
      <Card pt:root:class="bg-gradient-primary text-white border-none shadow-lg shadow-indigo-500/10">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-white/80 uppercase tracking-wider">รายได้วันนี้</h2>
              <p class="text-3xl font-extrabold mt-1">{{ stats?.todayRevenue ?? 0 }}</p>
              <p class="text-[10px] text-white/70 mt-1">เหรียญ</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <i class="pi pi-bolt text-2xl text-white"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Revenue -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-0 shadow-xs">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">รายได้รวม</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ stats?.totalRevenue?.toLocaleString() ?? 0 }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">เหรียญสะสมทั้งหมด</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <i class="pi pi-wallet text-2xl text-primary"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Service Minutes -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-0 shadow-xs">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">นาทีที่ให้บริการ</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ stats?.serviceDurationMinutes?.toLocaleString() ?? 0 }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">{{ formatDuration(stats?.serviceDurationMinutes ?? 0) }}</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <i class="pi pi-clock text-2xl text-indigo-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Average Rating -->
      <Card pt:root:class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-0 shadow-xs">
        <template #content>
          <div class="flex justify-between items-center gap-4 py-1">
            <div class="flex flex-col">
              <h2 class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">คะแนนเฉลี่ย</h2>
              <p class="text-3xl font-extrabold mt-1 text-surface-900 dark:text-surface-0">{{ stats?.averageRating?.toFixed(2) ?? '0.00' }}</p>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 mt-1">{{ stats?.reviewCount ?? 0 }} รีวิว</p>
            </div>
            <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <i class="pi pi-star-fill text-2xl text-yellow-500"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Revenue Statistics Chart -->
    <Card pt:root:class="bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-800/80 shadow-xs">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-bold text-surface-900 dark:text-surface-0">สถิติรายได้สะสม</h2>
            <p class="text-sm text-surface-500 dark:text-surface-400">ภาพรวมรายได้ของคุณในช่วงเวลาที่เลือก</p>
          </div>
          <ClientOnly>
            <PaymentEarningsChart :trends="stats?.revenueTrends ?? []" />
          </ClientOnly>
        </div>
      </template>
    </Card>

    <!-- Withdrawal Section (Mobile-first Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Withdrawable Balance & Banker Account -->
      <Card pt:root:class="lg:col-span-1 bg-surface-50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-800/80 shadow-xs">
        <template #content>
          <div class="flex flex-col gap-4">
            <!-- Header Balance -->
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-surface-900 dark:text-surface-0">
                <i class="pi pi-wallet text-xl text-primary"></i>
                <p class="text-base font-bold">ยอดถอนได้</p>
              </div>
              <div class="flex flex-col">
                <p class="text-3xl font-black text-surface-900 dark:text-surface-0">16,555</p>
                <p class="text-xs text-surface-500 dark:text-surface-400 font-medium">เหรียญ · ≈ ฿16,555</p>
              </div>
              <div class="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 mt-1">
                <i class="pi pi-info-circle text-xs"></i>
                <p class="text-[11px]">รอดำเนินการ 800 เหรียญ</p>
              </div>
            </div>

            <Divider pt:root:class="my-2 border-surface-200 dark:border-surface-800" />

            <!-- Bank Account Binding -->
            <div class="flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2 text-surface-800 dark:text-surface-200">
                  <i class="pi pi-credit-card text-lg"></i>
                  <p class="text-sm font-semibold">บัญชีรับเงิน</p>
                </div>
                <Button
                  @click="visible = true"
                  outlined
                  label="ผูกบัญชี"
                  icon="pi pi-plus"
                  pt:root:class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200" />
              </div>
              <div class="p-3 rounded-xl bg-surface-0 dark:bg-surface-900 border border-surface-200/60 dark:border-surface-800/60 flex flex-col gap-0.5">
                <p class="text-sm font-bold text-surface-900 dark:text-surface-0">ธ.กสิกรไทย</p>
                <p class="text-xs text-surface-500 dark:text-surface-400">•••• 6345 · punsan somkla</p>
              </div>
            </div>

            <!-- Withdraw Button -->
            <Button
              label="ถอนเงิน"
              icon="pi pi-arrow-down"
              pt:root:class="w-full bg-gradient-primary border-none rounded-xl text-white font-semibold py-2.5 shadow-md shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-2" />
          </div>
        </template>
      </Card>

      <!-- Withdrawal History -->
      <Card pt:root:class="lg:col-span-2 bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-surface-0 shadow-xs">
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <i class="pi pi-history text-xl text-indigo-500"></i>
              <p class="text-base font-bold text-surface-900 dark:text-surface-0">ประวัติการถอนเงิน</p>
            </div>
            
            <div class="flex flex-col gap-3">
              <!-- Item 1 -->
              <Card pt:root:class="bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-800 shadow-none hover:translate-x-0.5 transition-transform duration-200">
                <template #content>
                  <div class="flex justify-between items-center py-1">
                    <div class="flex flex-col gap-1">
                      <div class="flex gap-2 items-center">
                        <p class="text-sm font-bold text-surface-900 dark:text-surface-0">ธ.กสิกรไทย</p>
                        <Badge value="สำเร็จ" severity="success" pt:root:class="text-[10px] px-2 py-0.5 rounded-full" />
                      </div>
                      <p class="text-xs text-surface-500 dark:text-surface-400">•••• 6345 · 23 มิ.ย. 2569 20:33</p>
                    </div>
                    <div class="flex flex-col items-end">
                      <p class="text-base font-extrabold text-red-500">-1,000</p>
                      <p class="text-[10px] text-surface-500 dark:text-surface-400">เหรียญ</p>
                    </div>
                  </div>
                </template>
              </Card>

              <!-- Item 2 -->
              <Card pt:root:class="bg-surface-50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-800 shadow-none hover:translate-x-0.5 transition-transform duration-200">
                <template #content>
                  <div class="flex justify-between items-center py-1">
                    <div class="flex flex-col gap-1">
                      <div class="flex gap-2 items-center">
                        <p class="text-sm font-bold text-surface-900 dark:text-surface-0">ธ.กสิกรไทย</p>
                        <Badge value="กำลังโอน" severity="warn" pt:root:class="text-[10px] px-2 py-0.5 rounded-full" />
                      </div>
                      <p class="text-xs text-surface-500 dark:text-surface-400">•••• 6345 · 23 มิ.ย. 2569 20:33</p>
                    </div>
                    <div class="flex flex-col items-end">
                      <p class="text-base font-extrabold text-red-500">-1,000</p>
                      <p class="text-[10px] text-surface-500 dark:text-surface-400">เหรียญ</p>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialogs -->
    <PaymentSetBankerDialog v-model:visible="visible" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { IFindAllRentStatisticsData } from '~/models/response/DasboardRes.model'
import DashboardProvider from '~/resource/provider/Dashboard.provider'

const visible = ref<boolean>(false)
const dashboardService = new DashboardProvider()
const { $handleLoading } = useNuxtApp()
const stats = ref<IFindAllRentStatisticsData | null>(null)
const isLoading = ref<boolean>(false)

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