<template>
  <div class="flex flex-col gap-4 relative transition-colors duration-250 p-4">
    <div class="flex gap-2 items-center justify-between">
      <div class="flex gap-4 items-center">
        <ButtonBack
        use-history-fallback
        icon="prime:chevron-left"
        label=""
        class="hover:scale-[1.02] transition-transform duration-200" />
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-slate-900 dark:text-slate-100">แดชบอร์ดรายได้</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">ภาพรวมรายได้ของคุณ</p>  
          </div>
      </div>
      <Button label="ถอนเงิน" icon="prime:arrow-down" pt:root:class="bg-gradient-primary border-none"/>
    </div>
    <div class="flex gap-4">
      <Card class="bg-gradient-primary text-white">
        <template #content>
          <div class="flex justify-between gap-12">

            <div class="flex flex-col">
              <h2 class="text-sm font-semibold">รายได้วันนี้</h2>
              <p class="text-2xl font-bold">{{ stats?.todayRevenue ?? 0 }}</p>
              <p class="text-xs text-slate-300">เหรียญ</p>
            </div>
            <i class="pi pi-wallet text-4xl"></i>
          </div>
        </template>
      </Card>
      <Card class="bg-gradient-primary text-white">
        <template #content>
          <div class="flex justify-between gap-12">

            <div class="flex flex-col">
              <h2 class="text-sm font-semibold">รายได้รวม</h2>
              <p class="text-2xl font-bold">{{ stats?.totalRevenue?.toLocaleString() ?? 0 }}</p>
              <p class="text-xs text-slate-300">เหรียญสะสมทั้งหมด</p>
            </div>
            <i class="pi pi-wallet text-4xl"></i>
          </div>
        </template>
      </Card>
      <Card class="bg-gradient-primary text-white">
        <template #content>
          <div class="flex justify-between gap-12">

            <div class="flex flex-col">
              <h2 class="text-sm font-semibold">นาทีที่ให้บริการ</h2>
              <p class="text-2xl font-bold">{{ stats?.serviceDurationMinutes?.toLocaleString() ?? 0 }}</p>
              <p class="text-xs text-slate-300">{{ formatDuration(stats?.serviceDurationMinutes ?? 0) }}</p>
            </div>
            <i class="pi pi-wallet text-4xl"></i>
          </div>
        </template>
      </Card>
      <Card class="bg-gradient-primary text-white">
        <template #content>
          <div class="flex justify-between gap-12">

            <div class="flex flex-col">
              <h2 class="text-sm font-semibold">คะแนนเฉลี่ย</h2>
              <p class="text-2xl font-bold">{{ stats?.averageRating?.toFixed(2) ?? '0.00' }}</p>
              <p class="text-xs text-slate-300">{{ stats?.reviewCount ?? 0 }} รีวิว</p>
            </div>
            <i class="pi pi-wallet text-4xl"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <Card class="bg-slate-50 dark:bg-slate-800">
      <template #content>
        <div class="flex flex-col gap-4">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">สถิติรายได้สะสม</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">ภาพรวมรายได้ของคุณในช่วงเวลาที่เลือก</p>
          <ClientOnly>
            <PaymentEarningsChart :trends="stats?.revenueTrends ?? []" />
          </ClientOnly>
        </div>
      </template>
    </Card>
    <div class="flex gap-4">

      <Card class="w-xl bg-slate-50 dark:bg-slate-800">
        <template #content>
          <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <i class="pi pi-wallet text-2xl"></i>
                <p class="text-lg font-semibold text-slate-900 dark:text-slate">
                  ยอดถอนได้
                </p>
              </div>
              <div class="flex flex-col">
                <p>16,555</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">เหรียญ · ≈ ฿16,555</p>
              </div>
              <div class="flex gap-2">
                <i class="pi pi-info-circle text-slate-500 dark:text-slate-400"></i>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  รอดำเนินการ 800 เหรียญ
                </p>
              </div>
              <Divider />
              <div class="flex justify-between items-center">
               <div class="flex gap-2">
                <i class="pi pi-wallet text-2xl"></i>
                <p>บัญชีรับเงิน</p>
               </div>
               <Button @click="visible = true" outlined label="ผูกบัญชี" icon="pi pi-plus" />
              </div>
              <div>
                <p>ธ.กสิกรไทย</p>
                <p>•••• 6345 · punsan somkla</p>
              </div>
              <Button label="ถอนเงิน" icon="pi pi-arrow-down" class="w-full" />
          </div>
        </template>
      </Card>
      <Card class="w-full">
        <template #content>
          <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <i class="pi pi-wallet text-2xl"></i>
                <p class="text-lg font-semibold text-slate-900 dark:text-slate">
                  ประวัติการถอนเงิน
                </p>
              </div>
              <Card>
                <template #content>
                  <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                      <div class="flex gap-2 items-center">
                        <p>ธ.กสิกรไทย</p>
                        <Badge value="สำเร็จ" severity="success" icon="pi pi-spinner"></Badge>
                      </div>
                      <p>•••• 6345 · 23 มิ.ย. 2569 20:33</p>
                    </div>
                    <div class="flex flex-col items-end">
                      <p>-1,000</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">เหรียญ</p>
                    </div>

                  </div>
                </template>
              </Card>
              <Card>
                <template #content>
                  <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                      <div class="flex gap-2 items-center">
                        <p>ธ.กสิกรไทย</p>
                        <Badge value="กำลังโอน" severity="success" icon="pi pi-spinner"></Badge>
                      </div>
                      <p>•••• 6345 · 23 มิ.ย. 2569 20:33</p>
                    </div>
                    <div class="flex flex-col items-end">
                      <p>-1,000</p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">เหรียญ</p>
                    </div>

                  </div>
                </template>
              </Card>
          </div>
        </template>
      </Card>
    </div>
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