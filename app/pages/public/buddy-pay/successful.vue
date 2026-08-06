<template>
  <div class="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:px-6">
    <div class="w-full max-w-md">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center gap-4 py-16">
        <i class="pi pi-spin pi-spinner text-4xl text-indigo-500" />
        <p class="text-sm text-surface-500 font-medium">กำลังตรวจสอบการชำระเงิน...</p>
      </div>

      <!-- Success state -->
      <Card
        v-else-if="isSuccess"
        :pt="{
          root: { class: 'rounded-3xl border border-surface-200 dark:border-surface-800 shadow-xl' },
          body: { class: 'p-6 sm:p-8' }
        }">
        <template #content>
          <div class="flex flex-col items-center text-center gap-4">
            <!-- Success icon -->
            <div class="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <i class="pi pi-check-circle text-4xl text-emerald-500" />
            </div>

            <h1 class="text-2xl font-extrabold text-surface-900 dark:text-white">
              ชำระเงินสำเร็จ
            </h1>
            <p class="text-sm text-surface-500 dark:text-surface-400">
              คุณจะได้รับเหรียญหลังจากระบบยืนยันการชำระเงินเรียบร้อยแล้ว
            </p>

            <!-- Payment details -->
            <div class="w-full mt-4 space-y-3">
              <div class="flex justify-between items-center px-4 py-3 bg-surface-50 dark:bg-surface-900/60 rounded-xl">
                <span class="text-xs font-semibold text-surface-500">รหัสรายการ</span>
                <span class="text-xs font-bold text-surface-700 dark:text-surface-300 font-mono">
                  {{ paymentIntentId }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="w-full flex flex-col gap-3 mt-6">
              <Button
                label="กลับที่หน้าซื้อเหรียญ"
                class="w-full"
                @click="router.push('/public/coin')" />
              <Button
                label="เริ่มใช้เหรียญเช่าคุย"
                severity="secondary"
                variant="outlined"
                class="w-full"
                @click="router.push('/public/rent')" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Invalid / unverified state -->
      <div
        v-else
        class="flex flex-col items-center gap-4 py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
          <i class="pi pi-exclamation-triangle text-3xl text-amber-500" />
        </div>
        <h2 class="text-xl font-bold text-surface-900 dark:text-white">
          ไม่สามารถยืนยันการชำระเงินได้
        </h2>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          กรุณาตรวจสอบที่หน้ากระเป๋าเหรียญหรือติดต่อฝ่ายสนับสนุน
        </p>
        <Button
          label="กลับที่หน้าซื้อเหรียญ"
          @click="router.push('/public/coin')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { IErrorResponse, TErrorResponse } from '~/models/response/Response.model'

definePageMeta({
  layout: 'navbar'
})

useSeoMeta({
  title: 'ชำระเงินสำเร็จ',
  description: 'การชำระเงินของคุณเสร็จสมบูรณ์'
})

const { $stripe } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const isSuccess = ref(false)
const paymentIntentId = ref('')

onMounted(async (): Promise<void> => {
  const clientSecret = route.query.payment_intent_client_secret as string

  if (!clientSecret || !$stripe) {
    isLoading.value = false
    return
  }

  try {
    const { paymentIntent } = await $stripe.retrievePaymentIntent(clientSecret)

    if (paymentIntent?.status === 'succeeded') {
      isSuccess.value = true
      paymentIntentId.value = paymentIntent.id
    }
  } catch (err: TErrorResponse) {
    console.error('[SuccessPage] retrievePaymentIntent error:', err)
  } finally {
    isLoading.value = false
  }
})
</script>
