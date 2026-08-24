<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[490px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header -->
    <div class="relative w-full flex flex-col items-center gap-3 px-6 pt-8 pb-3 text-center select-none">
      <!-- Back Button -->
      <button
        class="absolute left-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="handleBack">
        <i class="pi pi-chevron-left text-base" />
      </button>

      <!-- Close Button -->
      <button
        class="absolute right-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20">
        <i class="pi pi-qrcode text-xs" />
        <span>PromptPay QR Payment</span>
      </div>

      <h6 class="font-extrabold text-2xl text-surface-900 dark:text-white tracking-wide">
        สแกน QR ชำระเงิน
      </h6>
      <p class="text-xs text-surface-500 dark:text-surface-400 max-w-[360px]">
        สแกน QR Code ผ่านแอปพลิเคชันธนาคารและแนบสลิปเพื่อรับเหรียญทันที
      </p>
    </div>

    <!-- Summary Box -->
    <div class="flex items-center justify-between px-5 py-3.5 mx-6 my-1 bg-surface-50 dark:bg-surface-800/60 rounded-2xl border border-surface-200/80 dark:border-surface-700/60">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
          <i class="pi pi-bitcoin text-amber-500 text-xl animate-[pulse_3s_infinite]" />
        </span>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-surface-400">เหรียญที่จะได้รับ</span>
          <span class="text-base font-extrabold text-surface-900 dark:text-surface-50 tabular-nums">
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

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16 gap-3">
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-primary-400/30 opacity-75" />
        <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
      </div>
      <span class="text-xs font-semibold text-surface-500 dark:text-surface-400">
        กำลังสร้าง PromptPay QR Code...
      </span>
    </div>

    <!-- Error State -->
    <div
      v-else-if="errorMessage && !orderData"
      class="px-6 py-10 flex flex-col items-center gap-4 text-center">
      <div class="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <i class="pi pi-exclamation-triangle text-2xl" />
      </div>
      <p class="text-xs font-medium text-surface-600 dark:text-surface-300 max-w-xs">
        {{ errorMessage }}
      </p>
      <button
        class="px-6 py-2.5 bg-gradient-primary hover:opacity-95 text-white font-bold rounded-xl transition-all duration-200 border-none text-xs cursor-pointer shadow-md shadow-indigo-500/15"
        type="button"
        @click="initOrder">
        ลองอีกครั้ง
      </button>
    </div>

    <!-- Order Display Container -->
    <div
      v-else-if="orderData"
      class="px-6 py-2 flex flex-col items-center gap-4">
      <!-- QR Frame Container -->
      <div class="relative flex flex-col items-center justify-center p-5 bg-white rounded-3xl border border-surface-200 shadow-md">
        <!-- Thai QR / PromptPay Header Banner -->
        <div class="flex items-center gap-2 mb-3 bg-[#003057] text-white px-4 py-1.5 rounded-xl text-[11px] font-extrabold tracking-wider shadow-sm">
          <i class="pi pi-qrcode text-cyan-300" />
          <span>THAI QR PAYMENT · PROMPTPAY</span>
        </div>

        <!-- QR Code Image -->
        <div class="relative p-2 bg-white rounded-2xl border border-slate-100 shadow-inner">
          <img
            v-if="orderData.qrImageBase64"
            :src="orderData.qrImageBase64"
            alt="PromptPay QR Code"
            class="w-48 h-48 sm:w-52 sm:h-52 object-contain">
        </div>

        <!-- Reference & Expiration -->
        <div class="mt-3 text-center space-y-2 w-full">
          <!-- Ref Number & Copy Button -->
          <div class="flex items-center justify-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200/60">
            <span class="text-[11px] font-semibold text-slate-500">อ้างอิง:</span>
            <span class="font-mono text-xs font-bold text-slate-800 tracking-wider">{{ orderData.ref1 }}</span>
            <button
              :title="copiedRef ? 'คัดลอกแล้ว' : 'คัดลอกเลขอ้างอิง'"
              class="text-slate-400 hover:text-indigo-600 transition-colors border-none bg-transparent p-0.5 cursor-pointer ml-1"
              type="button"
              @click="handleCopyRef(orderData.ref1)">
              <i :class="copiedRef ? 'pi pi-check text-emerald-500' : 'pi pi-copy text-xs'" />
            </button>
          </div>

          <!-- Countdown Timer -->
          <div
            v-if="qrRemainingSeconds > 0"
            :class="[
              'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-colors',
              qrRemainingSeconds <= 60
                ? 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse'
                : 'text-amber-600 bg-amber-50 border-amber-200'
            ]">
            <i class="pi pi-clock text-xs" />
            <span>QR หมดอายุใน {{ formatSeconds(qrRemainingSeconds) }}</span>
          </div>

          <div
            v-else
            class="flex flex-col items-center gap-1.5">
            <span class="text-xs font-bold text-rose-500">QR Code หมดอายุแล้ว</span>
            <button
              :disabled="isRefreshing"
              class="px-3.5 py-1.5 bg-gradient-primary text-white text-xs font-bold rounded-xl hover:opacity-95 border-none cursor-pointer flex items-center gap-1.5 shadow-sm shadow-indigo-500/20"
              type="button"
              @click="handleRefreshQr">
              <i
                v-if="isRefreshing"
                class="pi pi-spin pi-spinner text-xs" />
              <span>ขอ QR Code ใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Slip Upload Section -->
      <div class="w-full space-y-2.5 pt-1">
        <label class="block text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider text-left">
          แนบสลิปโอนเงินเพื่อตรวจสอบ
        </label>

        <!-- Dropzone / File Picker -->
        <div
          :class="selectedFile ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20' : 'border-surface-300 dark:border-surface-700 hover:border-indigo-400 bg-surface-50/50 dark:bg-surface-800/40'"
          class="relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
          @click="triggerFileInput">
          <input
            ref="fileInputRef"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            class="hidden"
            type="file"
            @change="handleFileChange">

          <!-- Selected File Preview -->
          <template v-if="selectedFile">
            <div class="flex items-center gap-3 w-full">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="Slip preview"
                class="w-12 h-16 object-cover rounded-xl border border-emerald-400 shadow-sm">
              <div class="flex flex-col text-left overflow-hidden">
                <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate">{{ selectedFile.name }}</span>
                <span class="text-[10px] text-surface-400 font-medium">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
              </div>
              <button
                class="ml-auto text-surface-400 hover:text-red-500 border-none bg-transparent p-1.5 cursor-pointer rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                type="button"
                @click.stop="clearFile">
                <i class="pi pi-trash text-sm" />
              </button>
            </div>
          </template>

          <template v-else>
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-primary-500 mb-1.5">
              <i class="pi pi-upload text-xl" />
            </div>
            <p class="text-xs font-bold text-surface-700 dark:text-surface-200">
              คลิกเพื่อเลือกภาพสลิป หรือลากไฟล์มาวาง
            </p>
            <p class="text-[10px] text-surface-400 mt-0.5">
              รองรับไฟล์ JPG, PNG, WEBP (สูงสุด 10MB)
            </p>
          </template>
        </div>

        <!-- Verification Error Message -->
        <div
          v-if="errorMessage"
          class="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2 text-xs text-red-500 font-medium">
          <i class="pi pi-exclamation-circle text-base flex-shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Verification Success Message -->
        <div
          v-if="verificationSuccess"
          class="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
          <i class="pi pi-check-circle text-lg flex-shrink-0 text-emerald-500" />
          <span>ตรวจสอบสลิปสำเร็จ! ได้รับ {{ coins.toLocaleString('th-TH') }} เหรียญเข้ากระเป๋าเรียบร้อยแล้ว</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2.5 pt-2">
          <button
            class="w-1/3 py-3 bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 font-bold rounded-2xl transition-all duration-200 border-none text-xs cursor-pointer"
            type="button"
            @click="handleCancelOrder">
            ยกเลิก
          </button>

          <button
            :disabled="!selectedFile || isVerifying || verificationSuccess"
            class="w-2/3 py-3 bg-gradient-primary hover:opacity-95 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200 border-none text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            type="button"
            @click="handleVerifySlip">
            <i
              v-if="isVerifying"
              class="pi pi-spin pi-spinner text-sm" />
            <span>{{ isVerifying ? 'กำลังตรวจสอบสลิป...' : 'ยืนยันสลิปโอนเงิน' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Security Footer -->
    <div class="flex items-center justify-center gap-1.5 text-center text-[10px] text-surface-400 dark:text-surface-500 font-medium mt-3 mb-5 select-none px-6">
      <i class="pi pi-shield-check text-emerald-500 text-xs" />
      <span>ความปลอดภัยขั้นสูง: เข้ารหัสด้วย SSL และระบบยืนยันสลิปอัตโนมัติ</span>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import type { IBuyCoinPackageData, IValidOrderData } from '~/models/response/PaymentRes.model'
import PaymentProvider, { type IPaymentProvider } from '~/resource/provider/Payment.provider'
import Dialog from '~/volt/Dialog.vue'

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
  (e: 'back' | 'success'): void
}>()

const PaymentService: IPaymentProvider = new PaymentProvider()

const isLoading = ref(false)
const isVerifying = ref(false)
const isRefreshing = ref(false)
const errorMessage = ref<string>('')
const verificationSuccess = ref(false)
const copiedRef = ref<boolean>(false)

const orderData = ref<IBuyCoinPackageData | IValidOrderData | null>(null)
const qrRemainingSeconds = ref<number>(0)
let timerInterval: any = null

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')

function formatSeconds (sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

function startCountdown (seconds: number): void {
  stopCountdown()
  qrRemainingSeconds.value = seconds
  timerInterval = setInterval((): void => {
    if (qrRemainingSeconds.value > 0) {
      qrRemainingSeconds.value--
    } else {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown (): void {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

async function handleCopyRef (refText: string): Promise<void> {
  if (!refText) return
  try {
    await navigator.clipboard.writeText(refText)
    copiedRef.value = true
    setTimeout((): void => {
      copiedRef.value = false
    }, 2000)
  } catch (err: any) {
    console.error('[QRPaymentDialog] copy error:', err)
  }
}

async function initOrder (): Promise<void> {
  if (!props.coinPackageId) return

  isLoading.value = true
  errorMessage.value = ''
  verificationSuccess.value = false

  try {
    // Check if user already has a valid order first
    const validRes = await PaymentService.getValidOrder().catch((err: any): null => {
      console.log('[QRPaymentDialog] No existing valid order found:', err)
      return null
    })

    if (validRes?.data) {
      orderData.value = validRes.data
      startCountdown(validRes.data.qrRemainingSeconds || 0)
    } else {
      // Create new order for coin package
      const createRes = await PaymentService.buyCoinPackage({ coinPackageId: props.coinPackageId })
      if (createRes?.data) {
        orderData.value = createRes.data
        startCountdown(createRes.data.qrRemainingSeconds || 0)
      } else {
        errorMessage.value = createRes?.message || 'ไม่สามารถสร้างคำสั่งซื้อได้'
      }
    }
  } catch (err: any) {
    console.error('[QRPaymentDialog] initOrder error:', err)
    errorMessage.value = err?.response?._data?.message || err?.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ'
  } finally {
    isLoading.value = false
  }
}

async function handleRefreshQr (): Promise<void> {
  isRefreshing.value = true
  errorMessage.value = ''
  try {
    const res = await PaymentService.refreshOrder()
    if (res?.data) {
      orderData.value = res.data
      startCountdown(res.data.qrRemainingSeconds || 0)
    }
  } catch (err: any) {
    console.error('[QRPaymentDialog] refreshOrder error:', err)
    errorMessage.value = err?.response?._data?.message || err?.message || 'ไม่สามารถรีเฟรช QR Code ได้'
  } finally {
    isRefreshing.value = false
  }
}

async function handleCancelOrder (): Promise<void> {
  const currentOrder = orderData.value
  if (currentOrder) {
    const id = 'orderId' in currentOrder ? currentOrder.orderId : currentOrder.id
    await PaymentService.cancelOrder(id).catch((err: any): void => {
      console.error('[QRPaymentDialog] cancelOrder error:', err)
    })
  }
  orderData.value = null
  stopCountdown()
  visible.value = false
}

function triggerFileInput (): void {
  fileInputRef.value?.click()
}

function handleFileChange (event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
    errorMessage.value = ''
  }
}

function clearFile (): void {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

async function handleVerifySlip (): Promise<void> {
  if (!selectedFile.value || isVerifying.value) return

  isVerifying.value = true
  errorMessage.value = ''

  try {
    const res = await PaymentService.verifySlip(selectedFile.value)
    if (res?.data?.valid) {
      verificationSuccess.value = true
      emit('success')
      setTimeout((): void => {
        visible.value = false
      }, 2000)
    } else {
      errorMessage.value = res?.message || 'สลิปโอนเงินไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง'
    }
  } catch (err: any) {
    console.error('[QRPaymentDialog] verifySlip error:', err)
    errorMessage.value = err?.response?._data?.message || err?.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิป'
  } finally {
    isVerifying.value = false
  }
}

function handleBack (): void {
  emit('back')
}

watch(visible, (newVal: boolean): void => {
  if (newVal && props.coinPackageId) {
    initOrder()
  } else {
    stopCountdown()
    orderData.value = null
    clearFile()
    errorMessage.value = ''
    verificationSuccess.value = false
  }
})

onUnmounted((): void => {
  stopCountdown()
  clearFile()
})
</script>
