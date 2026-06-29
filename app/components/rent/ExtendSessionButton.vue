<template>
  <div
    v-if="isCustomer"
    class="w-full md:w-auto">
    <!-- Extend Button -->
    <Button
      :disabled="isButtonDisabled"
      icon="pi pi-clock"
      label="ต่อเวลา"
      pt:label:class="font-semibold text-xs"
      pt:root:class="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3.5 py-1.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 dark:border-emerald-900/40 dark:text-emerald-400 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      @click="openModal" />

    <!-- Extend Dialog -->
    <Dialog
      v-model:visible="showModal"
      class="w-11/12 sm:max-w-md"
      pt:content:class="p-6 flex flex-col gap-4"
      pt:header:class="p-6 pb-2 border-b border-slate-100 dark:border-slate-800/80 font-bold text-lg text-slate-850 dark:text-slate-100"
      pt:root:class="overflow-hidden border-none rounded-2xl bg-white dark:bg-slate-900 shadow-xl"
      dismissable-mask
      modal>
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-clock text-emerald-500 text-lg" />
          <span>ต่อเวลาสนทนา</span>
        </div>
      </template>

      <!-- Info & Limits -->
      <div class="bg-slate-50 dark:bg-slate-800/30 border border-slate-150 dark:border-slate-800/80 rounded-xl p-4 flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div class="flex justify-between">
          <span>เวลาปัจจุบัน:</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">{{ currentDuration }} นาที</span>
        </div>
        <div class="flex justify-between">
          <span>เวลาสูงสุดที่กำหนด:</span>
          <span class="font-bold text-slate-800 dark:text-slate-200">{{ maxDuration }} นาที</span>
        </div>
        <div class="flex justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
          <span>สามารถต่อเวลาได้อีกสูงสุด:</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ maxAllowedExtension }} นาที</span>
        </div>
      </div>

      <!-- Input Section -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300">จำนวนนาทีที่ต้องการเพิ่ม</label>
        <InputNumber
          v-model="additionalMinutes"
          :max="maxAllowedExtension"
          :min="1"
          fluid
          show-buttons />
      </div>

      <!-- Cost Calculation -->
      <div class="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-xl p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="pi pi-bitcoin text-amber-500 text-lg" />
          <div>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">
              ค่าใช้จ่ายเพิ่มเติม
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">
              อัตรา {{ coinRatePerMinute }} เหรียญ / นาที
            </p>
          </div>
        </div>
        <p class="text-lg font-black text-amber-600 dark:text-amber-400">
          {{ totalCoins }} เหรียญ
        </p>
      </div>

      <!-- Error Message -->
      <Message
        v-if="errorMessage"
        severity="error">
        {{ errorMessage }}
      </Message>

      <!-- Footer Buttons -->
      <div class="flex gap-3 justify-end mt-2">
        <Button
          label="ยกเลิก"
          pt:root:class="!px-4 !py-2 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-350 font-semibold rounded-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm bg-transparent"
          @click="closeModal" />
        <Button
          :disabled="isLoading || additionalMinutes <= 0 || additionalMinutes > maxAllowedExtension"
          :loading="isLoading"
          label="ยืนยันการต่อเวลา"
          pt:label:class="font-semibold text-xs sm:text-sm text-white"
          pt:root:class="bg-gradient-primary border-none !px-5 !py-2 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          @click="confirmExtend" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from '~/volt/Button.vue'
import Dialog from '~/volt/Dialog.vue'
import InputNumber from '~/volt/InputNumber.vue'
import Message from '~/volt/Message.vue'
import { RentStatusEnum } from '~/models/enums/Rent.enum'
import RentCustomerProvider from '~/resource/provider/RentCustomer.provider'
import { useAuthStore } from '~/stores/Auth'
import { useRentChatStore } from '~/stores/RentChat'
import { useSessionTimer } from '~/composables/useSessionTimer'

const props = defineProps<{
  sessionId: number
  maxDuration: number
  currentDuration: number
  coinRatePerMinute: number
}>()

const toast = useToast()
const rentProvider = new RentCustomerProvider()
const authStore = useAuthStore()
const store = useRentChatStore()
const timer = useSessionTimer(props.sessionId)

const showModal = ref<boolean>(false)
const additionalMinutes = ref<number>(10)
const isLoading = ref<boolean>(false)
const errorMessage = ref<string>('')

const isCustomer = computed((): boolean => {
  return store.item?.customerId === authStore.user.id
})

const maxAllowedExtension = computed((): number => {
  return Math.max(0, props.maxDuration - props.currentDuration)
})

const isButtonDisabled = computed((): boolean => {
  const status = store.item?.status
  const isFinished = status === RentStatusEnum.COMPLETED || status === RentStatusEnum.CANCELLED || status === RentStatusEnum.REJECTED
  const isMaxed = props.currentDuration >= props.maxDuration
  return isFinished || isMaxed
})

const totalCoins = computed((): number => {
  return (additionalMinutes.value || 0) * props.coinRatePerMinute
})

function openModal (): void {
  // Set default extension minutes to 10 or the remaining max allowed
  additionalMinutes.value = Math.min(10, maxAllowedExtension.value)
  errorMessage.value = ''
  showModal.value = true
}

function closeModal (): void {
  showModal.value = false
}

async function confirmExtend (): Promise<void> {
  const mins = additionalMinutes.value
  if (mins <= 0 || mins > maxAllowedExtension.value) return

  isLoading.value = true
  errorMessage.value = ''

  // Optimistic UI Update: immediately add to remainingSeconds and set isExpired to false
  const addedSeconds = mins * 60
  timer.remainingSeconds.value += addedSeconds
  timer.isExpired.value = false

  try {
    const response = await rentProvider.extendSession(props.sessionId, { additionalMinutes: mins })
    if (response.data) {
      toast.add({
        severity: 'success',
        summary: 'ต่อเวลาสำเร็จ',
        detail: `ต่อเวลาสนทนาเพิ่มอีก ${mins} นาทีเรียบร้อยแล้วค่ะ`,
        life: 3000
      })

      // Sync store's session data (updates durationMinutes, coinPaid, etc.)
      await store.fetchSession(props.sessionId)

      // Sync timer values from server to ensure perfect accuracy
      await timer.syncWithServer()

      showModal.value = false
    }
  } catch (error: any) {
    // Revert optimistic update on failure
    timer.remainingSeconds.value = Math.max(0, timer.remainingSeconds.value - addedSeconds)
    if (timer.remainingSeconds.value <= 0) {
      timer.isExpired.value = true
    }

    const rawMsg = error?.response?.data?.message || error?.message || ''
    if (rawMsg.includes('INSUFFICIENT_BALANCE') || rawMsg.includes('insufficient balance')) {
      errorMessage.value = 'เหรียญของคุณไม่พอสำหรับการต่อเวลา กรุณาเติมเหรียญก่อนนะคะ'
    } else if (rawMsg.includes('maxDuration') || rawMsg.includes('exceed')) {
      errorMessage.value = 'ไม่สามารถต่อเวลาเกินเวลาสูงสุดที่กำหนดได้ค่ะ'
    } else {
      errorMessage.value = rawMsg || 'เกิดข้อผิดพลาดในการต่อเวลา กรุณาลองใหม่อีกครั้งค่ะ'
    }

    toast.add({
      severity: 'error',
      summary: 'ต่อเวลาไม่สำเร็จ',
      detail: errorMessage.value,
      life: 4000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
