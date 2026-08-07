<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="flex items-baseline justify-between">
      <h2 class="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white">
        ประวัติธุรกรรม
      </h2>
      <span
        v-if="transactions.length > 0"
        class="text-xs text-surface-500 dark:text-surface-400 font-semibold bg-surface-100 dark:bg-surface-800/80 px-2.5 py-1 rounded-full">
        {{ transactions.length }} รายการ
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
          v-if="isLoading"
          class="py-12 flex flex-col items-center justify-center gap-3">
          <i class="pi pi-spin pi-spinner text-2xl text-indigo-500" />
          <span class="text-xs text-surface-400">กำลังโหลดประวัติธุรกรรม...</span>
        </div>

        <template v-else-if="transactions.length > 0">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <div class="flex items-center gap-3">
              <!-- Icon Container -->
              <div :class="['h-10 w-10 flex items-center justify-center rounded-2xl shadow-inner border border-transparent', getTxIconBg(tx)]">
                <i :class="[getTxIcon(tx), 'text-sm sm:text-base']" />
              </div>
              <!-- Details -->
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-tight">
                  {{ tx.description || getTxTitle(tx) }}
                </span>
                <span class="text-[11px] text-surface-400 dark:text-surface-500 font-medium mt-1">
                  {{ getTxCategory(tx) }} · {{ formatTime(tx.createdAt) }}
                </span>
              </div>
            </div>

            <!-- Amount & Coin Icon -->
            <div class="flex items-center gap-1.5 pl-2">
              <span
                :class="[
                  'text-sm sm:text-base font-bold tracking-tight tabular-nums',
                  isTxPositive(tx) ? 'text-emerald-500 dark:text-emerald-400' : 'text-surface-900 dark:text-white'
                ]">
                {{ isTxPositive(tx) ? '+' : '-' }}{{ Math.abs(tx.amount).toLocaleString('th-TH') }}
              </span>
              <span class="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] inline-block" />
            </div>
          </div>
        </template>

        <div
          v-else
          class="py-12 flex flex-col items-center justify-center gap-2 text-center text-surface-400 dark:text-surface-500">
          <i class="pi pi-history text-3xl" />
          <span class="text-sm font-medium">ยังไม่มีประวัติธุรกรรม</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import WalletProvider from '~/resource/provider/Wallet.provider'
import type { ICoinTransaction } from '~/models/response/WallRes.model'

const walletService = new WalletProvider()
const transactions = ref<ICoinTransaction[]>([])
const isLoading = ref<boolean>(true)

const fetchTransactions = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await walletService.findWalletTransactions({ page: 1, limit: 20 })
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
