<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Loading state -->
    <div
      v-if="status === 'loading'"
      class="flex flex-col items-center justify-center py-6 gap-4 text-center">
      <i class="pi pi-spin pi-spinner text-4xl text-primary" />
      <p class="text-surface-600 dark:text-surface-300 font-medium">
        กำลังดำเนินการยืนยันอีเมลของคุณ...
      </p>
    </div>

    <!-- Success state -->
    <div
      v-else-if="status === 'success'"
      class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
        <i class="pi pi-check-circle text-4xl" />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-surface-900 dark:text-white">
          ยืนยันอีเมลสำเร็จ!
        </h3>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          {{ message || 'อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว' }}
        </p>
      </div>
      <div class="w-full flex flex-col gap-2 mt-2">
        <Button
          v-if="isLoggedIn"
          label="ไปยังหน้าหลัก"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="goToHome" />
        <Button
          v-else
          label="เข้าสู่ระบบเพื่อใช้งาน"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="goToLogin" />
      </div>
    </div>

    <!-- Already verified state -->
    <div
      v-else-if="status === 'already_verified'"
      class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
        <i class="pi pi-verified text-4xl" />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-surface-900 dark:text-white">
          อีเมลนี้ได้รับการยืนยันแล้ว
        </h3>
        <p class="text-sm text-surface-500 dark:text-surface-400">
          บัญชีของคุณได้รับการยืนยันอีเมลเรียบร้อยแล้ว สามารถใช้งานได้ทันที
        </p>
      </div>
      <div class="w-full flex flex-col gap-2 mt-2">
        <Button
          v-if="isLoggedIn"
          label="ไปยังหน้าหลัก"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="goToHome" />
        <Button
          v-else
          label="เข้าสู่ระบบ"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="goToLogin" />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
        <i class="pi pi-exclamation-circle text-4xl" />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-surface-900 dark:text-white">
          การยืนยันอีเมลไม่สำเร็จ
        </h3>
        <p class="text-sm text-red-500/90 dark:text-red-400">
          {{ message }}
        </p>
      </div>
      <div class="w-full flex flex-col gap-3 mt-2">
        <Button
          v-if="isLoggedIn"
          :loading="isResending"
          label="ส่งอีเมลยืนยันอีกครั้ง"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="resendVerification" />
        <Button
          v-if="isLoggedIn"
          label="กลับไปยังหน้าโปรไฟล์"
          pt:root:class="rounded-xl py-3 w-full"
          severity="secondary"
          variant="outlined"
          @click="goToProfile" />
        <Button
          v-else
          label="เข้าสู่ระบบ"
          pt:label:class="font-bold"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
          @click="goToLogin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

definePageMeta({
  title: 'ยืนยันอีเมล',
  description: 'ยืนยันที่อยู่อีเมลของคุณสำหรับบัญชี Buddy Hub'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const authService: IAuthProvider = new AuthProvider()

type TVerifyStatus = 'loading' | 'success' | 'already_verified' | 'error'

const status = ref<TVerifyStatus>('loading')
const message = ref<string>('')
const isResending = ref<boolean>(false)

const isLoggedIn = computed((): boolean => Boolean(authStore.userToken.accessToken))

async function processEmailVerification (): Promise<void> {
  const token = (route.query.token as string)
    || (route.query.accessToken as string)
    || ''

  if (!token) {
    if (isLoggedIn.value && authStore.user.isVerified) {
      status.value = 'already_verified'
      message.value = 'อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว'
      return
    }

    status.value = 'error'
    message.value = 'ไม่พบโทเค็นสำหรับการยืนยันอีเมล กรุณากดลิงก์จากอีเมลที่คุณได้รับ หรือขอรับอีเมลยืนยันใหม่อีกครั้ง'
    return
  }

  status.value = 'loading'

  try {
    const response = await authService.verifyEmail(token)
    status.value = 'success'
    message.value = response?.message || 'ยืนยันอีเมลสำเร็จเรียบร้อยแล้ว'

    if (isLoggedIn.value) {
      authStore.updateUser({
        ...authStore.user,
        isVerified: true
      })
    }

    toast.add({
      severity: 'success',
      summary: 'ยืนยันอีเมลสำเร็จ',
      detail: 'อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว',
      life: 5000
    })
  } catch (err: any) {
    const errMessage = err?.response?.data?.message || err?.message || ''

    if (
      errMessage.includes('ได้รับการยืนยันแล้ว')
      || errMessage.includes('already verified')
      || errMessage.includes('verified')
    ) {
      status.value = 'already_verified'
      message.value = 'อีเมลนี้ได้รับการยืนยันเรียบร้อยแล้ว'

      if (isLoggedIn.value) {
        authStore.updateUser({
          ...authStore.user,
          isVerified: true
        })
      }
      return
    }

    status.value = 'error'
    message.value = errMessage || 'ลิงก์ยืนยันอีเมลหมดอายุหรือไม่ถูกต้อง กรุณาขอรับอีเมลยืนยันใหม่อีกครั้ง'
  }
}

async function resendVerification (): Promise<void> {
  if (!isLoggedIn.value) {
    goToLogin()
    return
  }

  isResending.value = true
  try {
    const res = await authService.sendEmailVerification()
    toast.add({
      severity: 'success',
      summary: 'ส่งอีเมลยืนยันสำเร็จ',
      detail: res?.message || 'ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องข้อความในอีเมลของคุณ',
      life: 5000
    })
  } catch (err: any) {
    const errMessage = err?.response?.data?.message || err?.message || 'ไม่สามารถส่งอีเมลยืนยันได้'
    toast.add({
      severity: 'error',
      summary: 'ส่งอีเมลยืนยันไม่สำเร็จ',
      detail: errMessage,
      life: 5000
    })
  } finally {
    isResending.value = false
  }
}

function goToHome (): void {
  router.push({ name: 'public-home' })
}

function goToLogin (): void {
  router.push({ name: 'auth-login' })
}

function goToProfile (): void {
  router.push({ name: 'public-profile' })
}

onMounted((): void => {
  void processEmailVerification()
})
</script>

<style scoped>
</style>
