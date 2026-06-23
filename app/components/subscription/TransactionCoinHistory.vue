<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="flex items-baseline justify-between">
      <h2 class="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white">
        ประวัติธุรกรรม
      </h2>
      <span class="text-xs text-surface-500 dark:text-surface-400 font-semibold bg-surface-100 dark:bg-surface-800/80 px-2.5 py-1 rounded-full">
        8 รายการ
      </span>
    </div>

    <!-- Transactions List Card -->
    <Card
      :pt="{
        root: {
          class: 'border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900/40 rounded-3xl shadow-none'
        },
        body: {
          class: 'p-5 sm:p-6'
        },
        content: {
          class: 'divide-y divide-surface-100 dark:divide-surface-800/60'
        }
      }">
      <template #content>
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
          <div class="flex items-center gap-3">
            <!-- Icon Container -->
            <div :class="['h-10 w-10 flex items-center justify-center rounded-2xl shadow-inner border border-transparent', tx.iconBg]">
              <i :class="[tx.icon, 'text-sm sm:text-base']" />
            </div>
            <!-- Details -->
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-tight">
                {{ tx.title }}
              </span>
              <span class="text-[11px] text-surface-400 dark:text-surface-500 font-medium mt-1">
                {{ tx.category }} · {{ tx.time }}
              </span>
            </div>
          </div>

          <!-- Amount & Coin Icon -->
          <div class="flex items-center gap-1.5 pl-2">
            <span
              :class="[
                'text-sm sm:text-base font-bold tracking-tight tabular-nums',
                tx.isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-surface-900 dark:text-white'
              ]">
              {{ tx.isPositive ? '+' : '-' }}{{ tx.amount.toLocaleString('th-TH') }}
            </span>
            <!-- Small Yellow Coin Dot -->
            <span class="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] inline-block" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
interface Transaction {
  id: number
  type: string
  title: string
  category: string
  time: string
  amount: number
  isPositive: boolean
  icon: string
  iconBg: string
}

const transactions = ref<Transaction[]>([
  {
    id: 1,
    type: 'topup',
    title: 'เติมเหรียญแพ็คเกจ 💎 Popular',
    category: 'เติมเหรียญ',
    time: '30 minutes ago',
    amount: 350,
    isPositive: true,
    icon: 'pi pi-arrow-down-left',
    iconBg: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/10'
  },
  {
    id: 2,
    type: 'gift_send',
    title: 'ส่งของขวัญ 🌹 ให้ @mayapatel',
    category: 'ส่งของขวัญ',
    time: 'about 2 hours ago',
    amount: 50,
    isPositive: false,
    icon: 'pi pi-gift',
    iconBg: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/10'
  },
  {
    id: 3,
    type: 'spend',
    title: 'เช่าคุยกับ @alexchen 30 นาที',
    category: 'ใช้จ่าย',
    time: 'about 6 hours ago',
    amount: 120,
    isPositive: false,
    icon: 'pi pi-arrow-up-right',
    iconBg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/10'
  },
  {
    id: 4,
    type: 'gift_receive',
    title: 'ได้รับของขวัญ 💸 จาก @rileykim',
    category: 'รับของขวัญ',
    time: '1 day ago',
    amount: 25,
    isPositive: true,
    icon: 'pi pi-gift',
    iconBg: 'bg-teal-500/10 text-teal-500 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/10'
  },
  {
    id: 5,
    type: 'bonus',
    title: 'โบนัสเช็คอินรายวัน 7 วันต่อเนื่อง',
    category: 'ได้รับ',
    time: '1 day ago',
    amount: 100,
    isPositive: true,
    icon: 'pi pi-sparkles',
    iconBg: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/10'
  },
  {
    id: 6,
    type: 'spend',
    title: 'เช่าคุยกับ @sagethompson 15 นาที',
    category: 'ใช้จ่าย',
    time: '2 days ago',
    amount: 60,
    isPositive: false,
    icon: 'pi pi-arrow-up-right',
    iconBg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/10'
  },
  {
    id: 7,
    type: 'topup',
    title: 'เติมเหรียญแพ็คเกจ 💰',
    category: 'เติมเหรียญ',
    time: '3 days ago',
    amount: 150,
    isPositive: true,
    icon: 'pi pi-arrow-down-left',
    iconBg: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/10'
  },
  {
    id: 8,
    type: 'refund',
    title: 'คืนเหรียญจากการยกเลิกเซสชัน',
    category: 'คืนเงิน',
    time: '4 days ago',
    amount: 30,
    isPositive: true,
    icon: 'pi pi-refresh',
    iconBg: 'bg-slate-500/10 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/10'
  }
])
</script>
