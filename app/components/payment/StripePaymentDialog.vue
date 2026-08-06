<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[446px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header -->
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

      <h6 class="font-bold text-2xl text-surface-900 dark:text-white tracking-wide">
        ชำระด้วยบัตร
      </h6>
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 max-w-[340px]">
        กรอกข้อมูลบัตรเพื่อชำระเงิน
      </p>
    </div>

    <!-- Amount Summary -->
    <div class="flex items-center justify-between px-6 py-4 mx-6 my-2 bg-surface-50 dark:bg-surface-900/60 rounded-2xl border border-surface-200 dark:border-surface-800/80">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
          <i class="pi pi-bitcoin text-amber-500 text-xl animate-[pulse_3s_infinite]" />
        </span>
        <span class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-50">{{ coins }} เหรียญ</span>
      </div>
      <span class="text-2xl font-black bg-gradient-to-r from-cyan-550 to-violet-550 dark:from-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
        ฿{{ price }}
      </span>
    </div>

    <!-- Loading State: Creating PaymentIntent -->
    <div
      v-if="isCreatingIntent"
      class="flex flex-col items-center justify-center py-12 gap-3">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-500" />
      <span class="text-sm text-surface-500 dark:text-surface-400 font-medium">กำลังเตรียมการชำระเงิน...</span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage"
      class="px-6 py-8 flex flex-col items-center gap-4">
      <div class="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500" />
      </div>
      <p class="text-sm text-surface-600 dark:text-surface-400 text-center font-medium">
        {{ errorMessage }}
      </p>
      <button
        class="px-6 py-2.5 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 font-bold rounded-xl transition-all duration-200 border-none text-sm cursor-pointer"
        type="button"
        @click="retryCreateIntent">
        ลองอีกครั้ง
      </button>
    </div>

    <!-- Stripe Payment Element Container -->
    <div
      v-else
      class="px-6 py-4">
      <div
        id="stripe-payment-element"
        ref="paymentElementRef"
        class="min-h-[200px]" />

      <!-- Pay Button -->
      <div class="mt-6">
        <button
          :disabled="isConfirming"
          class="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 transition-all duration-200 border-none text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          type="button"
          @click="handleConfirmPayment">
          <i
            v-if="isConfirming"
            class="pi pi-spin pi-spinner" />
          <span>{{ isConfirming ? 'กำลังดำเนินการ...' : 'ชำระเงิน' }}</span>
        </button>
      </div>
    </div>

    <div class="text-center text-[10px] text-surface-450 dark:text-surface-500 font-medium mt-4 mb-6 select-none">
      ความปลอดภัยขั้นสูง: เข้ารหัสด้วย SSL 256-bit และประมวลผลผ่าน Stripe
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import type { Stripe, StripeElements } from '@stripe/stripe-js'
import Dialog from '~/volt/Dialog.vue'
import PaymentProvider, { type IPaymentProvider } from '~/resource/provider/Payment.provider'
import { PaymentMethodEnum } from '~/models/enums/Paymen.enum'

interface Props {
  coinPackageId?: number
  coins?: number
  price?: number
}

const props = withDefaults(defineProps<Props>(), {
  coinPackageId: 0,
  coins: 0,
  price: 0
})

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{
  (e: 'back'): void
}>()

const { $stripe } = useNuxtApp()
const config = useRuntimeConfig()

const PaymentService: IPaymentProvider = new PaymentProvider()

const paymentElementRef = ref<HTMLElement | null>(null)
const isCreatingIntent = ref(false)
const isConfirming = ref(false)
const errorMessage = ref<string>('')

let stripeElements: StripeElements | null = null
let clientSecret: string = ''

// Create PaymentIntent and mount Payment Element
async function createPaymentIntent (): Promise<void> {
  if (!$stripe || !props.coinPackageId) return

  isCreatingIntent.value = true
  errorMessage.value = ''

  try {
    const response = await PaymentService.BuyCoinPackageWithStripe({
      coinPackageId: props.coinPackageId,
      paymentMethod: PaymentMethodEnum.CREDIT_CARD
    })

    clientSecret = response.clientSecret

    if (!clientSecret) {
      errorMessage.value = 'ไม่สามารถเตรียมการชำระเงินได้ กรุณาลองใหม่'
      return
    }

    // Mount Stripe Payment Element
    await nextTick()
    mountPaymentElement($stripe, clientSecret)
  } catch (err: any) {
    console.error('[StripePaymentDialog] createPaymentIntent error:', err)
    errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'
  } finally {
    isCreatingIntent.value = false
  }
}

function mountPaymentElement (stripe: Stripe, secret: string): void {
  destroyElements()

  stripeElements = stripe.elements({
    clientSecret: secret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
        borderRadius: '12px',
        fontFamily: '"Inter", sans-serif'
      }
    }
  })

  const paymentElement = stripeElements.create('payment', {
    layout: 'tabs'
  })

  if (paymentElementRef.value) {
    paymentElement.mount(paymentElementRef.value)
  }
}

// Confirm payment
async function handleConfirmPayment (): Promise<void> {
  if (!$stripe || !stripeElements || isConfirming.value) return

  isConfirming.value = true

  try {
    const siteUrl = config.public.siteUrl as string
    const { error } = await $stripe.confirmPayment({
      elements: stripeElements,
      confirmParams: {
        return_url: `${siteUrl}/public/buddy-pay/successful`
      }
    })

    // If error, Stripe did NOT redirect — show error inline
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        errorMessage.value = error.message || 'ข้อมูลบัตรไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
      } else {
        errorMessage.value = 'เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่'
      }
    }
    // If no error, Stripe redirected — this code won't execute
  } catch (err: any) {
    console.error('[StripePaymentDialog] confirmPayment error:', err)
    errorMessage.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่'
  } finally {
    isConfirming.value = false
  }
}

function retryCreateIntent (): void {
  errorMessage.value = ''
  createPaymentIntent()
}

function handleBack (): void {
  emit('back')
}

function destroyElements (): void {
  if (stripeElements) {
    stripeElements = null
  }
  clientSecret = ''
}

// Watch dialog visibility to init/cleanup
watch(visible, (newVal: boolean): void => {
  if (newVal && props.coinPackageId) {
    createPaymentIntent()
  } else {
    destroyElements()
    errorMessage.value = ''
    isCreatingIntent.value = false
    isConfirming.value = false
  }
})

onUnmounted((): void => {
  destroyElements()
})
</script>
