<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="space-y-1">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white bg-gradient-primary bg-clip-text text-transparent inline-block">
        กระเป๋าเหรียญ
      </h1>
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 font-medium">
        จัดการเหรียญสำหรับเช่าคุย ส่งของขวัญ และปลดล็อกฟีเจอร์พิเศษ
      </p>
    </div>

    <!-- Balance Card -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
      <!-- Ambient background glow elements -->
      <div class="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />

      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <!-- Left Side: Current Balance -->
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-white/80 text-xs sm:text-sm font-medium">
            <i class="pi pi-sync text-cyan-200 animate-[spin_20s_linear_infinite]" />
            <span>ยอดเหรียญคงเหลือ</span>
          </div>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums">{{ userBalance.toLocaleString('th-TH') }}</span>
            <span class="text-sm sm:text-base font-semibold text-white/90">เหรียญ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Up Header -->
    <div class="flex items-baseline justify-between pt-2">
      <h2 class="text-lg sm:text-xl font-extrabold text-surface-900 dark:text-white">
        เติมเหรียญ
      </h2>
      <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">
        เลือกแพ็กเกจที่เหมาะกับคุณ
      </span>
    </div>

    <!-- Packages Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <template v-if="props.items && props.items.length > 0">
        <Card
          v-for="pkg in props.items"
          :key="pkg.id"
          :pt="{
            root: {
              class: [
                'relative flex flex-col items-center p-6 rounded-3xl border transition-all duration-300 group shadow-none',
                pkg.isBestValue
                  ? 'border-indigo-500/50 bg-indigo-50/5 dark:bg-indigo-950/5 ring-1 ring-indigo-500/20'
                  : pkg.discount > 0
                    ? 'border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-950/5 ring-1 ring-emerald-500/20'
                    : 'border-surface-200/70 dark:border-surface-800/80 bg-surface-0 dark:bg-surface-900/40 hover:border-indigo-400/40 dark:hover:border-indigo-500/30'
              ].join(' ')
            },
            body: {
              class: 'p-0 flex flex-col items-center h-full w-full'
            },
            content: {
              class: 'p-0 flex flex-col items-center h-full w-full'
            }
          }">
          <template #content>
            <!-- Best Value Badge -->
            <div
              v-if="pkg.isBestValue"
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
              คุ้มที่สุด
            </div>

            <!-- Discount Badge if not Best Value -->
            <div
              v-else-if="pkg.discount > 0"
              class="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
              ลด {{ pkg.discount }}%
            </div>

            <!-- Package Icon -->
            <div class="h-16 w-16 rounded-2xl bg-surface-50 dark:bg-surface-800/80 flex items-center justify-center text-3xl mb-4 shadow-sm border border-surface-100 dark:border-surface-700/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <img
                v-if="pkg.iconUrl"
                :alt="pkg.name"
                :src="pkg.iconUrl"
                class="w-10 h-10 object-contain">
              <i
                v-else
                class="pi pi-bitcoin text-amber-500 text-3xl" />
            </div>

            <!-- Package Name -->
            <div class="text-center font-bold text-sm text-surface-700 dark:text-surface-300 mb-1">
              {{ pkg.name }}
            </div>

            <!-- Amount & Bonus -->
            <div class="text-center space-y-1">
              <div class="flex items-baseline justify-center gap-1">
                <span class="text-3xl font-black text-surface-900 dark:text-white">{{ pkg.coinAmount?.toLocaleString('th-TH') }}</span>
                <span class="text-xs font-semibold text-surface-500 dark:text-slate-400">เหรียญ</span>
              </div>
              <div
                v-if="pkg.bonusCoin && pkg.bonusCoin > 0"
                class="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center justify-center gap-1">
                + โบนัส {{ pkg.bonusCoin.toLocaleString('th-TH') }} 🎁
              </div>
            </div>

            <!-- Price -->
            <div class="text-center mt-6 mb-4">
              <span class="text-2xl font-black text-surface-900 dark:text-white">฿{{ pkg.price?.toLocaleString('th-TH') }}</span>
              <p class="text-[10px] text-surface-400 dark:text-surface-500 font-semibold mt-1">
                ≈ {{ calculateUnitPrice(pkg).toFixed(2) }} ฿/เหรียญ
              </p>
            </div>

            <!-- Button -->
            <Button
              label="เติมเลย"
              pt:root:class="w-full mt-auto rounded-2xl bg-gradient-primary hover:opacity-95 text-white font-bold py-2.5 px-4 text-sm transition-all duration-200 active:scale-[0.98] border-none shadow-sm shadow-indigo-500/10 hover:shadow-indigo-500/20"
              type="button"
              @click="handleSelectPackage(pkg)" />
          </template>
        </Card>
      </template>

      <div
        v-else
        class="col-span-full py-12 text-center text-surface-400 dark:text-surface-500 font-medium">
        ไม่พบแพ็กเกจเหรียญในขณะนี้
      </div>
    </div>

    <Message
      icon="pi pi-send"
      size="small">
      เหรียญใช้สำหรับเช่าคุยกับ Emotional Supporter, ส่งของขวัญ, และปลดล็อกฟีเจอร์พิเศษ · เหรียญไม่มีหมดอายุ
    </Message>
  </div>

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

const walletService = new WalletProvider()

const fetchUserBalance = async (): Promise<void> => {
  try {
    const res = await walletService.findWalletBalance()
    if (res?.data) {
      userBalance.value = res.data.balance || 0
    }
  } catch (err: any) {
    console.error('[CoinPackages] fetchUserBalance error:', err)
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
