<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[460px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header -->
    <div class="relative w-full flex flex-col items-center gap-3 px-6 pt-8 pb-3 text-center select-none">
      <!-- Close Button -->
      <button
        class="absolute right-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-500/20">
        <i class="pi pi-credit-card text-xs" />
        <span>เลือกช่องทางชำระเงิน</span>
      </div>

      <h6 class="font-extrabold text-2xl text-surface-900 dark:text-white tracking-wide">
        ชำระเงินเติมเหรียญ
      </h6>

      <p class="text-xs text-surface-500 dark:text-surface-400 max-w-[340px]">
        เลือกช่องทางที่คุณสะดวกเพื่อดำเนินการต่ออย่างปลอดภัย
      </p>
    </div>

    <!-- Package Summary Card -->
    <div class="flex items-center justify-between px-5 py-4 mx-6 my-1 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-200/80 dark:border-surface-700/60">
      <div class="flex items-center gap-3">
        <span class="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
          <i class="pi pi-bitcoin text-amber-500 text-2xl animate-[pulse_3s_infinite]" />
        </span>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-surface-400">เหรียญที่จะได้รับ</span>
          <span class="text-base sm:text-lg font-extrabold text-surface-900 dark:text-surface-50 tabular-nums">
            {{ coins.toLocaleString('th-TH') }} เหรียญ
          </span>
        </div>
      </div>

      <div class="flex flex-col items-end">
        <span class="text-[11px] font-semibold text-surface-400">ยอดชำระ</span>
        <span class="text-2xl font-black bg-gradient-primary bg-clip-text text-transparent tabular-nums">
          ฿{{ price.toLocaleString('th-TH') }}
        </span>
      </div>
    </div>

    <!-- Section Title -->
    <div class="px-6 pt-4 pb-2 flex items-center justify-between text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
      <span>ช่องทางการชำระเงิน</span>
      <span class="text-[10px] text-emerald-500 font-semibold lowercase">อนุมัติอัตโนมัติ</span>
    </div>

    <!-- Payment Methods List -->
    <div class="flex flex-col gap-3 px-6">
      <div
        v-for="method in paymentMethods"
        :key="method.id"
        :class="[
          selectedMethod === method.id
            ? 'border-indigo-500/80 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-[0_0_16px_rgba(99,102,241,0.12)] ring-1 ring-indigo-500/30'
            : 'border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900/40 hover:border-surface-300 dark:hover:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/40'
        ]"
        class="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none"
        @click="selectedMethod = method.id">
        <div class="flex items-center gap-3.5">
          <!-- Icon Box -->
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-primary text-white shadow-md shadow-indigo-500/20">
            <i :class="[method.icon, 'text-xl text-white']" />
          </div>

          <!-- Labels -->
          <div class="flex flex-col gap-0.5 text-left">
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-surface-900 dark:text-surface-100">{{ method.name }}</span>
              <span
                v-if="method.badge"
                class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {{ method.badge }}
              </span>
            </div>
            <span class="text-xs text-surface-500 dark:text-surface-400 font-medium">{{ method.subtext }}</span>
          </div>
        </div>

        <!-- Custom Radio Button -->
        <div
          :class="[
            selectedMethod === method.id
              ? 'border-indigo-500 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
              : 'border-2 border-surface-300 dark:border-surface-700 bg-transparent'
          ]"
          class="w-5 h-5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0">
          <i
            v-if="selectedMethod === method.id"
            class="pi pi-check text-[10px] text-white font-bold" />
        </div>
      </div>
    </div>

    <!-- Proceed Button -->
    <div class="px-6 mt-6">
      <button
        class="w-full py-3.5 bg-gradient-primary hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200 border-none text-sm cursor-pointer flex items-center justify-center gap-2"
        type="button"
        @click="handleProceed">
        <i class="pi pi-qrcode text-base" />
        <span>สแกน PromptPay QR & แนบสลิป</span>
      </button>
    </div>

    <!-- Footer Note -->
    <div class="flex items-center justify-center gap-1.5 text-center text-[11px] text-surface-500 dark:text-surface-400 font-medium mt-4 mb-6 px-6">
      <i class="pi pi-shield-check text-emerald-500 text-xs" />
      <span>สบายใจได้! ระบบตรวจสอบสลิปอัตโนมัติรวดเร็วและปลอดภัย 100%</span>
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
  coins: 0,
  price: 0
})

const visible = defineModel<boolean>('visible', { default: false })

interface PaymentMethod {
  id: string
  name: string
  subtext: string
  icon: string
  badge?: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'promptpay',
    name: 'PromptPay QR Code',
    subtext: 'สแกนจ่ายผ่านแอปธนาคาร และแนบสลิปโอนเงิน',
    icon: 'pi pi-qrcode',
    badge: 'แนะนำ'
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
