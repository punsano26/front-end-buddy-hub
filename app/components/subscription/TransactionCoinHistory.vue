<template>
  <div class="space-y-4">
    <!-- Header Section with Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 text-primary-500 flex items-center justify-center">
          <i class="pi pi-history text-sm" />
        </div>
        <div>
          <h2 class="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white">
            ประวัติธุรกรรมเหรียญ
          </h2>
          <p class="text-xs text-surface-500 dark:text-surface-400 font-medium">
            บันทึกการเติมเหรียญและการใช้จ่ายทั้งหมด
          </p>
        </div>
      </div>

      <!-- Action & Filter Pills -->
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-surface-100 dark:bg-surface-800/80 p-1 rounded-2xl text-xs font-semibold">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            :class="[
              currentFilter === tab.value
                ? 'bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-white shadow-xs'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white'
            ]"
            class="px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border-none bg-transparent"
            type="button"
            @click="currentFilter = tab.value">
            {{ tab.label }}
          </button>
        </div>

        <button
          :disabled="isLoading"
          class="h-8 w-8 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 flex items-center justify-center text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors cursor-pointer border-none"
          title="รีเฟรชประวัติ"
          type="button"
          @click="fetchTransactions">
          <i
            :class="{ 'animate-spin': isLoading }"
            class="pi pi-sync text-xs" />
        </button>
      </div>
    </div>

    <!-- Transactions Card -->
    <div class="rounded-3xl border border-surface-200/80 dark:border-surface-800 bg-surface-0 dark:bg-surface-900/50 p-4 sm:p-6 backdrop-blur-sm shadow-sm">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="py-16 flex flex-col items-center justify-center gap-3">
        <i class="pi pi-spin pi-spinner text-2xl text-primary-500" />
        <span class="text-xs font-medium text-surface-400">กำลังโหลดประวัติธุรกรรม...</span>
      </div>

      <!-- Filtered List -->
      <div
        v-else-if="filteredTransactions.length > 0"
        class="divide-y divide-surface-100 dark:divide-surface-800/60">
        <div
          v-for="tx in filteredTransactions"
          :key="tx.id"
          class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 px-2 rounded-2xl transition-colors">
          <div class="flex items-center gap-3.5">
            <!-- Icon Container -->
            <div :class="['h-11 w-11 flex items-center justify-center rounded-2xl shadow-inner border border-transparent flex-shrink-0', getTxIconBg(tx)]">
              <i :class="[getTxIcon(tx), 'text-base']" />
            </div>

            <!-- Details -->
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">
                {{ tx.description || getTxTitle(tx) }}
              </span>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                  {{ getTxCategory(tx) }}
                </span>
                <span class="text-[11px] text-surface-400 dark:text-surface-500 font-medium">
                  {{ formatTime(tx.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Amount & Coin Tag -->
          <div class="flex items-center gap-2 pl-3 flex-shrink-0">
            <span
              :class="[
                'text-sm sm:text-base font-extrabold tracking-tight tabular-nums',
                isTxPositive(tx) ? 'text-emerald-500 dark:text-emerald-400' : 'text-surface-900 dark:text-white'
              ]">
              {{ isTxPositive(tx) ? '+' : '-' }}{{ Math.abs(tx.amount).toLocaleString('th-TH') }}
            </span>
            <span class="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <i class="pi pi-bitcoin text-amber-500 text-[10px]" />
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="py-14 flex flex-col items-center justify-center gap-2.5 text-center">
        <div class="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400">
          <i class="pi pi-receipt text-2xl" />
        </div>
        <p class="text-sm font-semibold text-surface-600 dark:text-surface-300">
          {{ currentFilter === 'all' ? 'ยังไม่มีประวัติธุรกรรมเหรียญ' : 'ไม่พบรายการในหมวดหมู่นี้' }}
        </p>
        <p class="text-xs text-surface-400 max-w-xs">
          เมื่อคุณเติมเหรียญหรือใช้งานเหรียญ รายการจะปรากฏที่นี่โดยอัตโนมัติ
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import WalletProvider from '~/resource/provider/Wallet.provider'
import type { ICoinTransaction } from '~/models/response/WallRes.model'

const walletService = new WalletProvider()
const transactions = ref<ICoinTransaction[]>([])
const isLoading = ref<boolean>(true)
const currentFilter = ref<'all' | 'topup' | 'spent'>('all')

const filterTabs = [
  { label: 'ทั้งหมด', value: 'all' as const },
  { label: 'เติมเหรียญ', value: 'topup' as const },
  { label: 'ใช้จ่าย/โอน', value: 'spent' as const }
]

const fetchTransactions = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await walletService.findWalletTransactions({ page: 1, limit: 30 })
    transactions.value = res?.data || []
  } catch (err: any) {
    console.error('[TransactionCoinHistory] fetchTransactions error:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted((): void => {
  fetchTransactions()
})

const isTxPositive = (tx: ICoinTransaction): boolean => {
  const positiveTypes = ['TOP_UP', 'TRANSFER_IN', 'EARNED', 'REFUNDED']
  return positiveTypes.includes(tx.transactionType) || tx.amount > 0
}

const filteredTransactions = computed((): ICoinTransaction[] => {
  if (currentFilter.value === 'all') return transactions.value
  if (currentFilter.value === 'topup') {
    return transactions.value.filter((tx: ICoinTransaction): boolean => isTxPositive(tx))
  }
  return transactions.value.filter((tx: ICoinTransaction): boolean => !isTxPositive(tx))
})

const getTxTitle = (tx: ICoinTransaction): string => {
  switch (tx.transactionType) {
    case 'TOP_UP':
      return 'เติมเหรียญเข้ากระเป๋า'
    case 'TRANSFER_IN':
      return 'ได้รับเหรียญจากผู้ใช้'
    case 'TRANSFER_OUT':
      return 'โอนเหรียญให้ผู้ใช้'
    case 'SPENT':
      return 'ใช้เหรียญในระบบ'
    case 'REFUNDED':
      return 'คืนเหรียญจากการยกเลิก'
    default:
      return 'รายการธุรกรรม'
  }
}

const getTxCategory = (tx: ICoinTransaction): string => {
  switch (tx.transactionType) {
    case 'TOP_UP':
      return 'เติมเหรียญ'
    case 'TRANSFER_IN':
    case 'EARNED':
      return 'ได้รับ'
    case 'TRANSFER_OUT':
    case 'SPENT':
      return 'ใช้จ่าย'
    case 'REFUNDED':
      return 'คืนเงิน'
    default:
      return 'ธุรกรรม'
  }
}

const getTxIcon = (tx: ICoinTransaction): string => {
  if (isTxPositive(tx)) {
    return 'pi pi-arrow-down-left'
  }
  return 'pi pi-arrow-up-right'
}

const getTxIconBg = (tx: ICoinTransaction): string => {
  if (isTxPositive(tx)) {
    return 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400'
  }
  return 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400'
}

const formatTime = (dateStr: string): string => {
  if (!dateStr) return ''
  return dayjs(dateStr).fromNow()
}
</script>
