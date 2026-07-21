<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[446px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header with logo and back/close buttons (like auth page layout) -->
    <div class="relative w-full flex flex-col items-center gap-4 px-[30px] pt-10 pb-2 text-center select-none">
      <!-- Close Button -->
      <button
        class="absolute right-6 top-6 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800/40 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>

      <!-- Title -->
      <h6 class="font-bold text-2xl text-surface-900 dark:text-white tracking-wide">
        ชำระเงิน
      </h6>

      <!-- Description -->
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 max-w-[340px]">
        โปรดเลือกช่องทางการชำระเงินเพื่อเติมเหรียญ
      </p>
    </div>

    <!-- Package Summary Row -->
    <div class="flex items-center justify-between px-6 py-4 mx-6 my-2 bg-surface-50 dark:bg-surface-900/60 rounded-2xl border border-surface-200 dark:border-surface-800/80">
      <div class="flex items-center gap-3">
        <!-- Coin Icon -->
        <span class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
          <i class="pi pi-bitcoin text-amber-500 text-xl animate-[pulse_3s_infinite]" />
        </span>
        <span class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-50">{{ coins }} เหรียญ</span>
      </div>
      <span class="text-2xl font-black bg-gradient-to-r from-cyan-550 to-violet-550 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
        ฿{{ price }}
      </span>
    </div>

    <!-- Section Title -->
    <div class="px-6 pt-3 pb-2 text-xs font-bold text-surface-450 dark:text-surface-500 tracking-wider uppercase">
      เลือกช่องทางการชำระเงิน
    </div>

    <!-- Payment Methods List -->
    <div class="flex flex-col gap-3 px-6">
      <div
        v-for="method in paymentMethods"
        :key="method.id"
        :class="[
          selectedMethod === method.id
            ? 'border-emerald-500/80 bg-emerald-50/5 dark:bg-emerald-950/15 shadow-[0_0_12px_rgba(16,185,129,0.08)]'
            : 'border-surface-200 dark:border-surface-800/80 bg-surface-0 dark:bg-surface-900/30 hover:border-surface-300 dark:hover:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-900/50'
        ]"
        class="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none"
        @click="selectedMethod = method.id">
        <div class="flex items-center gap-3">
          <!-- Icon Box -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-sky-400 via-indigo-500 to-violet-500 shadow-md">
            <i :class="[method.icon, 'text-xl text-white']" />
          </div>
          <!-- Labels -->
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-bold text-surface-900 dark:text-surface-50">{{ method.name }}</span>
            <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">{{ method.subtext }}</span>
          </div>
        </div>
        <!-- Custom Radio Button -->
        <div
          :class="[
            selectedMethod === method.id
              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
              : 'border-2 border-surface-300 dark:border-surface-700'
          ]"
          class="w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center" />
      </div>
    </div>

    <!-- Proceed Button -->
    <div class="px-6 mt-6">
      <button
        class="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 transition-all duration-200 border-none text-base cursor-pointer"
        type="button"
        @click="handleProceed">
        ดำเนินการต่อ
      </button>
    </div>

    <div class="text-center text-[10px] text-surface-450 dark:text-surface-500 font-medium mt-4 mb-6">
      สบายใจได้! การชำระเงินของคุณจะถูกเข้ารหัสและปลอดภัยด้วย Omise
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '~/volt/Dialog.vue'

interface Props {
  coins?: number
  price?: number
}

withDefaults(defineProps<Props>(), {
  coins: 50,
  price: 35
})

const visible = defineModel<boolean>('visible', { default: false })

interface PaymentMethod {
  id: string
  name: string
  subtext: string
  icon: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'promptpay',
    name: 'PromptPay QR',
    subtext: 'สแกนจ่ายผ่านแอปธนาคาร',
    icon: 'pi pi-qrcode'
  },
  {
    id: 'truemoney',
    name: 'TrueMoney Wallet',
    subtext: 'ชำระผ่านวอลเล็ตทรูมันนี่',
    icon: 'pi pi-wallet'
  }
]

const selectedMethod = ref<string>('promptpay')

const emit = defineEmits<{
  (e: 'proceed', method: string): void
}>()

const handleProceed = (): void => {
  emit('proceed', selectedMethod.value)
}
</script>
