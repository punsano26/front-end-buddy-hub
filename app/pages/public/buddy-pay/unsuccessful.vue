<template>
  <div class="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:px-6">
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center gap-6 text-center">
        <!-- Failure icon -->
        <div class="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
          <i class="pi pi-times-circle text-4xl text-red-500" />
        </div>

        <h1 class="text-2xl font-extrabold text-surface-900 dark:text-white">
          การชำระเงินไม่สำเร็จ
        </h1>
        <p class="text-sm text-surface-500 dark:text-surface-400 max-w-sm">
          {{ statusMessage }}
        </p>

        <!-- Actions -->
        <div class="w-full flex flex-col gap-3 mt-4">
          <Button
            label="ลองชำระเงินอีกครั้ง"
            class="w-full"
            @click="router.push('/public/coin')" />
          <Button
            label="กลับหน้าหลัก"
            severity="secondary"
            variant="outlined"
            class="w-full"
            @click="router.push('/public/home')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TErrorResponse } from '~/models/response/Response.model'

definePageMeta({
  layout: 'navbar'
})

useSeoMeta({
  title: 'การชำระเงินไม่สำเร็จ',
  description: 'การชำระเงินของคุณไม่สำเร็จ กรุณาลองอีกครั้ง'
})

const { $stripe } = useNuxtApp()
const router = useRouter()
const route = useRoute()

const statusMessage = ref('การชำระเงินถูกยกเลิกหรือล้มเหลว กรุณาลองใหม่อีกครั้ง')

onMounted(async (): Promise<void> => {
  const clientSecret = route.query.payment_intent_client_secret as string

  if (!clientSecret || !$stripe) return

  try {
    const { paymentIntent } = await $stripe.retrievePaymentIntent(clientSecret)

    if (paymentIntent) {
      switch (paymentIntent.status) {
        case 'canceled':
          statusMessage.value = 'การชำระเงินถูกยกเลิก กรุณาลองใหม่อีกครั้ง'
          break
        case 'requires_payment_method':
          statusMessage.value = 'ข้อมูลบัตรไม่ถูกต้อง กรุณาลองวิธีชำระเงินอื่น'
          break
        case 'processing':
          statusMessage.value = 'การชำระเงินกำลังดำเนินการ กรุณารอสักครู่แล้วตรวจสอบอีกครั้ง'
          break
        default:
          statusMessage.value = 'การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
      }
    }
  } catch (err: TErrorResponse) {
    console.error('[UnsuccessPage] retrievePaymentIntent error:', err)
  }
})
</script>
