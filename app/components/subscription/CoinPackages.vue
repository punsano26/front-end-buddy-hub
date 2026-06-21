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
            <span class="text-4xl sm:text-5xl font-black tracking-tight tabular-nums">1,245</span>
            <span class="text-sm sm:text-base font-semibold text-white/90">เหรียญ</span>
          </div>
        </div>

        <!-- Right Side: Stats (Spent & Received) -->
        <div class="flex items-center gap-6 sm:gap-8 border-t border-white/10 sm:border-t-0 pt-4 sm:pt-0">
          <div class="flex flex-col sm:items-end gap-1">
            <div class="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
              <i class="pi pi-arrow-down-right text-red-300" />
              <span>ใช้ไปแล้ว</span>
            </div>
            <span class="text-xl sm:text-2xl font-bold tracking-tight tabular-nums">3,200</span>
          </div>
          <div class="flex flex-col sm:items-end gap-1">
            <div class="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
              <i class="pi pi-arrow-up-right text-emerald-300" />
              <span>ได้รับ</span>
            </div>
            <span class="text-xl sm:text-2xl font-bold tracking-tight tabular-nums">480</span>
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
      <Card
        v-for="pkg in packages"
        :key="pkg.id"
        :pt="{
          root: {
            class: [
              'relative flex flex-col items-center p-6 rounded-3xl border transition-all duration-300 group shadow-none',
              pkg.popular
                ? 'border-emerald-500/50 bg-emerald-50/5 dark:bg-emerald-950/5 ring-1 ring-emerald-500/20'
                : pkg.bestValue
                  ? 'border-indigo-500/50 bg-indigo-50/5 dark:bg-indigo-950/5 ring-1 ring-indigo-500/20'
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
          <!-- Popular Badge -->
          <div
            v-if="pkg.popular"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
            ยอดนิยม
          </div>

          <!-- Best Value Badge -->
          <div
            v-if="pkg.bestValue"
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
            คุ้มที่สุด
          </div>

          <!-- Package Emoji / Icon -->
          <div class="h-16 w-16 rounded-2xl bg-surface-50 dark:bg-surface-800/80 flex items-center justify-center text-3xl mb-4 shadow-sm border border-surface-100 dark:border-surface-700/30 group-hover:scale-110 transition-transform duration-300">
            {{ pkg.emoji }}
          </div>

          <!-- Amount & Bonus -->
          <div class="text-center space-y-1">
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-3xl font-black text-surface-900 dark:text-white">{{ pkg.coins.toLocaleString('th-TH') }}</span>
              <span class="text-xs font-semibold text-surface-500 dark:text-slate-400">เหรียญ</span>
            </div>
            <div
              v-if="pkg.bonus"
              class="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center justify-center gap-1">
              + โบนัส {{ pkg.bonus.toLocaleString('th-TH') }} 🎁
            </div>
          </div>

          <!-- Price -->
          <div class="text-center mt-6 mb-4">
            <span class="text-2xl font-black text-surface-900 dark:text-white">฿{{ pkg.price.toLocaleString('th-TH') }}</span>
            <p class="text-[10px] text-surface-400 dark:text-surface-500 font-semibold mt-1">
              ≈ {{ pkg.unitPrice.toFixed(2) }} ฿/เหรียญ
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
    </div>

    <Message
      icon="pi pi-send"
      size="small">
      เหรียญใช้สำหรับเช่าคุยกับ Emotional Supporter, ส่งของขวัญ, และปลดล็อกฟีเจอร์พิเศษ · เหรียญไม่มีหมดอายุ
    </message>
  </div>
  <ChoosePaymentDialog
    v-model:visible="paymentDialogVisible"
    :coins="selectedPackage?.coins"
    :price="selectedPackage?.price" />
</template>

<script lang="ts" setup>
import ChoosePaymentDialog from '~/components/payment/ChoosePaymentDialog.vue'

const paymentDialogVisible = ref(false)
const selectedPackage = ref<Package | null>(null)

const handleSelectPackage = (pkg: Package): void => {
  selectedPackage.value = pkg
  paymentDialogVisible.value = true
}

interface Package {
  id: number
  coins: number
  bonus?: number
  price: number
  unitPrice: number
  popular?: boolean
  bestValue?: boolean
  emoji: string
}

const packages = ref<Package[]>([
  { id: 1, coins: 50, price: 35, unitPrice: 0.7, emoji: '🏛️' },
  { id: 2, coins: 150, bonus: 15, price: 99, unitPrice: 0.6, emoji: '💰' },
  { id: 3, coins: 350, bonus: 50, price: 219, unitPrice: 0.55, popular: true, emoji: '💎' },
  { id: 4, coins: 800, bonus: 150, price: 499, unitPrice: 0.53, emoji: '👑' },
  { id: 5, coins: 2000, bonus: 500, price: 1199, unitPrice: 0.48, bestValue: true, emoji: '🏆' },
  { id: 6, coins: 5000, bonus: 1500, price: 2799, unitPrice: 0.43, emoji: '🚀' }
])
</script>
