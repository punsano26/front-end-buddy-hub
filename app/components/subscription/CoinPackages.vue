<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col gap-1.5">
      <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-500">
        <i class="pi pi-wallet text-sm" />
        <span>Coin Wallet & Packages</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white bg-gradient-primary bg-clip-text text-transparent inline-block">
        กระเป๋าเหรียญ
      </h1>
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 font-medium">
        จัดการเหรียญสำหรับเช่าคุย ส่งของขวัญ และปลดล็อกฟีเจอร์พิเศษบน Buddy Hub
      </p>
    </div>

    <!-- Balance Card -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/15 transition-all duration-300">
      <!-- Ambient background glow elements -->
      <div class="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/15 blur-2xl" />
      <div class="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-cyan-300/25 blur-2xl" />
      <div class="pointer-events-none absolute top-1/2 left-1/3 h-32 w-32 -translate-y-1/2 rounded-full bg-violet-400/20 blur-3xl" />

      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <!-- Left Side: Current Balance -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-white/85 text-xs sm:text-sm font-semibold">
            <span class="flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-pulse" />
            <span>ยอดเหรียญคงเหลือ</span>
          </div>

          <div class="flex items-baseline gap-2.5">
            <span class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums drop-shadow-sm">
              {{ userBalance.toLocaleString('th-TH') }}
            </span>
            <span class="text-base sm:text-lg font-bold text-white/90">
              เหรียญ
            </span>
          </div>

          <p class="text-[11px] sm:text-xs text-white/75 font-medium flex items-center gap-1.5 pt-0.5">
            <i class="pi pi-check-circle text-xs text-cyan-200" />
            <span>เหรียญไม่มีวันหมดอายุ สามารถใช้งานได้ทันที</span>
          </p>
        </div>

        <!-- Right Side: Action and Info -->
        <div class="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t border-white/15 pt-4 sm:border-t-0 sm:pt-0">
          <button
            :disabled="isRefreshingBalance"
            class="inline-flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-all duration-200 cursor-pointer disabled:opacity-60"
            type="button"
            @click="fetchUserBalance">
            <i
              :class="{ 'animate-spin': isRefreshingBalance }"
              class="pi pi-sync text-xs text-cyan-200" />
            <span>{{ isRefreshingBalance ? 'กำลังอัปเดต...' : 'รีเฟรชยอดเหรียญ' }}</span>
          </button>

          <div class="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <i class="pi pi-shield text-[10px]" />
            <span>กระเป๋าเงินปลอดภัย</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Up Section -->
    <div class="space-y-5">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <div class="space-y-0.5">
          <h2 class="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white">
            เติมเหรียญ
          </h2>
          <p class="text-xs text-surface-500 dark:text-surface-400 font-medium">
            เลือกแพ็กเกจเหรียญที่คุ้มค่าและตรงกับการใช้งานของคุณ
          </p>
        </div>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="props.items && props.items.length > 0">
          <div
            v-for="pkg in props.items"
            :key="pkg.id"
            :class="[
              'group relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 border backdrop-blur-sm',
              pkg.isBestValue
                ? 'border-indigo-500/60 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-1.5 ring-2 ring-indigo-500/20'
                : pkg.discount > 0
                  ? 'border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-sm hover:shadow-md hover:border-emerald-500/80 hover:-translate-y-1.5'
                  : 'border-surface-200/80 dark:border-surface-800 bg-surface-0 dark:bg-surface-900/60 shadow-sm hover:shadow-md hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:-translate-y-1.5'
            ]">
            <!-- Best Value Badge -->
            <div
              v-if="pkg.isBestValue"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md shadow-indigo-500/25 tracking-wide flex items-center gap-1">
              <span>🔥 คุ้มที่สุด</span>
            </div>

            <!-- Discount Badge if not Best Value -->
            <div
              v-else-if="pkg.discount > 0"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-md shadow-emerald-500/25 tracking-wide flex items-center gap-1">
              <span>🏷️ ลด {{ pkg.discount }}%</span>
            </div>

            <!-- Top Content -->
            <div class="flex flex-col items-center text-center pt-2">
              <!-- Package Icon Container -->
              <div class="relative h-18 w-18 rounded-2xl bg-surface-50 dark:bg-surface-800/90 flex items-center justify-center text-3xl mb-4 shadow-inner border border-surface-200/60 dark:border-surface-700/40 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <span class="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-orange-500/10 opacity-50" />
                <img
                  v-if="pkg.iconUrl"
                  :alt="pkg.name"
                  :src="pkg.iconUrl"
                  class="relative w-11 h-11 object-contain">
                <i
                  v-else
                  class="relative pi pi-bitcoin text-amber-500 text-3xl drop-shadow-sm group-hover:rotate-[15deg] transition-transform duration-300" />
              </div>

              <!-- Package Name -->
              <div class="font-bold text-sm text-surface-700 dark:text-surface-200 mb-1">
                {{ pkg.name }}
              </div>

              <!-- Coin Amount & Bonus Badge -->
              <div class="space-y-1.5 my-2">
                <div class="flex items-baseline justify-center gap-1.5">
                  <span class="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tabular-nums tracking-tight">
                    {{ pkg.coinAmount?.toLocaleString('th-TH') }}
                  </span>
                  <span class="text-xs font-bold text-surface-500 dark:text-surface-400">
                    เหรียญ
                  </span>
                </div>

                <!-- Bonus Pill -->
                <div
                  v-if="pkg.bonusCoin && pkg.bonusCoin > 0"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <i class="pi pi-gift text-[10px]" />
                  <span>+ โบนัส {{ pkg.bonusCoin.toLocaleString('th-TH') }} เหรียญ</span>
                </div>
              </div>
            </div>

            <!-- Bottom Content (Price & Button) -->
            <div class="flex flex-col items-center mt-6 pt-4 border-t border-surface-100 dark:border-surface-800/80 w-full">
              <div class="text-center mb-4">
                <div class="text-2xl font-black text-surface-900 dark:text-white tabular-nums">
                  ฿{{ pkg.price?.toLocaleString('th-TH') }}
                </div>
                <div class="inline-block text-[10px] text-surface-500 dark:text-surface-400 font-semibold mt-1 bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-md">
                  ≈ {{ calculateUnitPrice(pkg).toFixed(2) }} ฿ / เหรียญ
                </div>
              </div>

              <button
                class="w-full py-3 px-4 rounded-2xl bg-gradient-primary hover:opacity-95 text-white font-bold text-sm transition-all duration-200 active:scale-[0.98] border-none shadow-md shadow-indigo-500/15 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
                type="button"
                @click="handleSelectPackage(pkg)">
                <i class="pi pi-bolt text-xs text-cyan-200" />
                <span>เติมเหรียญแพ็กนี้</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Empty State -->
        <div
          v-else
          class="col-span-full py-16 flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-surface-200 dark:border-surface-800 bg-surface-0/50 dark:bg-surface-900/30 text-center">
          <div class="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400">
            <i class="pi pi-inbox text-2xl" />
          </div>
          <p class="text-sm font-semibold text-surface-600 dark:text-surface-300">
            ไม่พบแพ็กเกจเหรียญในขณะนี้
          </p>
          <p class="text-xs text-surface-400 max-w-sm">
            โปรดกลับมาตรวจสอบใหม่ในภายหลัง หรือติดต่อทีมงานหากต้องการความช่วยเหลือ
          </p>
        </div>
      </div>
    </div>

    <!-- Information & Safety Card -->
    <div class="rounded-3xl border border-surface-200/80 dark:border-surface-800/80 bg-surface-0/60 dark:bg-surface-900/40 p-5 sm:p-6 backdrop-blur-sm space-y-4">
      <div class="flex items-center gap-2.5 text-surface-900 dark:text-white font-bold text-sm">
        <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/20 dark:text-indigo-300">
          <i class="pi pi-info-circle text-base" />
        </span>
        <span>เงื่อนไขและการใช้งานเหรียญ</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-surface-600 dark:text-surface-300">
        <div class="flex items-start gap-2.5">
          <i class="pi pi-comments text-primary-500 mt-0.5 flex-shrink-0" />
          <span>ใช้สำหรับเช่าเพื่อนคุย Emotional Supporter และส่งของขวัญในแชท</span>
        </div>
        <div class="flex items-start gap-2.5">
          <i class="pi pi-hourglass text-amber-500 mt-0.5 flex-shrink-0" />
          <span>เหรียญไม่มีวันหมดอายุ ใช้งานได้ต่อเนื่องตลอดเวลา</span>
        </div>
        <div class="flex items-start gap-2.5">
          <i class="pi pi-shield-check text-emerald-500 mt-0.5 flex-shrink-0" />
          <span>ชำระเงินผ่าน PromptPay QR ปลอดภัย ตรวจสอบสลิปอัตโนมัติ</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialogs -->
  <ChoosePaymentDialog
    v-model:visible="paymentDialogVisible"
    :coins="(selectedPackage?.coinAmount || 0) + (selectedPackage?.bonusCoin || 0)"
    :price="selectedPackage?.price"
    @proceed="handleProceedPayment" />

  <QRPaymentDialog
    v-model:visible="qrDialogVisible"
    :coin-package-id="selectedPackage?.id"
    :coins="(selectedPackage?.coinAmount || 0) + (selectedPackage?.bonusCoin || 0)"
    :price="selectedPackage?.price"
    @back="handleBackToSelect"
    @success="handlePaymentSuccess" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ChoosePaymentDialog from '~/components/payment/ChoosePaymentDialog.vue'
import QRPaymentDialog from '~/components/payment/QRPaymentDialog.vue'
import type { ICoinList } from '~/models/response/CoinRes.model'
import WalletProvider from '~/resource/provider/Wallet.provider'

interface Props {
  items?: ICoinList[]
}

const props = withDefaults(defineProps<Props>(), {
  items: (): ICoinList[] => []
})

const paymentDialogVisible = ref(false)
const qrDialogVisible = ref(false)

const selectedPackage = ref<ICoinList | null>(null)
const userBalance = ref<number>(0)
const isRefreshingBalance = ref<boolean>(false)

const walletService = new WalletProvider()

const fetchUserBalance = async (): Promise<void> => {
  isRefreshingBalance.value = true
  try {
    const res = await walletService.findWalletBalance()
    if (res?.data) {
      userBalance.value = res.data.balance || 0
    }
  } catch (err: any) {
    console.error('[CoinPackages] fetchUserBalance error:', err)
  } finally {
    isRefreshingBalance.value = false
  }
}

onMounted((): void => {
  fetchUserBalance()
})

const calculateUnitPrice = (pkg: ICoinList): number => {
  const totalCoins = pkg.coinAmount + (pkg.bonusCoin || 0)
  return totalCoins > 0 ? pkg.price / totalCoins : 0
}

const handleSelectPackage = (pkg: ICoinList): void => {
  selectedPackage.value = pkg
  paymentDialogVisible.value = true
}

const handleProceedPayment = (_methodId: string): void => {
  paymentDialogVisible.value = false
  qrDialogVisible.value = true
}

const handleBackToSelect = (): void => {
  qrDialogVisible.value = false
  paymentDialogVisible.value = true
}

const handlePaymentSuccess = (): void => {
  fetchUserBalance()
}
</script>
