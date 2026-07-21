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
      <!-- Back Button -->
      <button
        class="absolute left-6 top-6 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800/40 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="handleBack">
        <i class="pi pi-chevron-left text-lg" />
      </button>

      <!-- Close Button -->
      <button
        class="absolute right-6 top-6 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800/40 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>


      <!-- Title -->
      <h6 class="font-bold text-2xl text-surface-900 dark:text-white tracking-wide">
        ชำระด้วย PromptPay
      </h6>

      <!-- Description -->
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 max-w-[340px]">
        สแกน QR Code ด้านล่างเพื่อชำระเงิน
      </p>
    </div>

    <!-- QR Code Area -->
    <div class="flex flex-col items-center px-6 py-2">
      <!-- PromptPay Logo Wrapper -->
      <div class="w-full max-w-[300px] bg-white rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-sm flex flex-col items-center">
        <!-- Thai QR Header -->
        <div class="w-full bg-[#0d2a54] py-3 px-4 flex justify-between items-center text-white select-none">
          <span class="text-xs font-bold tracking-wider">THAI QR PAYMENT</span>
          <span class="text-xs font-bold text-sky-400">PromptPay</span>
        </div>

        <!-- QR Code Placeholder -->
        <div class="p-6 bg-white flex flex-col items-center">
          <div class="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center relative bg-gray-50">
            <!-- Simulated QR Code SVG -->
            <svg
              class="w-40 h-40 text-surface-900"
              fill="currentColor"
              viewBox="0 0 100 100">
              <path d="M5,5 h30 v30 h-30 z M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" />
              <path d="M65,5 h30 v30 h-30 z M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" />
              <path d="M5,65 h30 v30 h-30 z M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" />
              <path d="M45,10 h10 v10 h-10 z M45,25 h15 v5 h-15 z M50,35 h5 v10 h-5 z" />
              <path d="M10,45 h10 v10 h-10 z M25,45 h15 v5 h-15 z M35,55 h10 v5 h-10 z" />
              <path d="M45,65 h10 v15 h-10 z M55,75 h15 v10 h-15 z M60,60 h10 v10 h-10 z" />
              <path d="M75,45 h15 v5 h-15 z M80,55 h10 v25 h-10 z M70,80 h10 v10 h-10 z" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <i class="pi pi-bitcoin text-amber-500 text-lg" />
              </div>
            </div>
          </div>
        </div>

        <!-- Account Info -->
        <div class="w-full border-t border-gray-100 bg-gray-50/50 py-3 px-4 text-center text-xs text-gray-600 font-semibold select-none">
          บัญชี: บจก. บัดดี้ ฮับ (Buddy Hub Co., Ltd.)
        </div>
      </div>

      <!-- Payment details & timer -->
      <div class="w-full max-w-[300px] mt-4 flex flex-col gap-2 text-center">
        <div class="text-2xl font-black text-surface-900 dark:text-white">
          ฿{{ price }}
        </div>
        <div class="text-[11px] text-surface-500 dark:text-surface-400 flex items-center justify-center gap-1.5 font-medium">
          <i
            class="pi pi-clock text-amber-500 animate-spin"
            style="animation-duration: 4s" />
          <span>QR Code จะหมดอายุใน</span>
          <span class="text-red-500 font-bold font-mono">{{ timeLeftFormatted }}</span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="px-6 mt-6 flex flex-col gap-2.5">
      <button
        class="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 transition-all duration-200 border-none text-base cursor-pointer"
        type="button"
        @click="handlePaid">
        ฉันชำระเงินเรียบร้อยแล้ว
      </button>
    </div>

    <div class="text-center text-[10px] text-surface-450 dark:text-surface-500 font-medium mt-4 mb-6 select-none">
      ความปลอดภัยขั้นสูง: เข้ารหัสด้วย SSL 256-bit และประมวลผลผ่าน Omise
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from '~/volt/Dialog.vue'

interface Props {
  coins?: number
  price?: number
}

const props = withDefaults(defineProps<Props>(), {
  coins: 50,
  price: 35
})

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{
  (e: 'back'): void
}>()

const toast = useToast()

// Countdown timer (15 minutes in seconds)
const initialTime = 15 * 60
const timeLeft = ref<number>(initialTime)
let timerInterval: any = null

const timeLeftFormatted = computed((): string => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startTimer = (): void => {
  stopTimer()
  timeLeft.value = initialTime
  timerInterval = setInterval((): void => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

watch(visible, (newVal: boolean): void => {
  if (newVal) {
    startTimer()
  } else {
    stopTimer()
  }
})

onMounted((): void => {
  if (visible.value) {
    startTimer()
  }
})

onUnmounted((): void => {
  stopTimer()
})

const handleBack = (): void => {
  emit('back')
}

const handlePaid = (): void => {
  toast.add({
    severity: 'success',
    summary: 'ชำระเงินสำเร็จ',
    detail: `ระบบเติมเหรียญจำนวน ${props.coins} เหรียญ เข้าบัญชีของคุณเรียบร้อยแล้ว`,
    life: 5000
  })
  visible.value = false
}
</script>
