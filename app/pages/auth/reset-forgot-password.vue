<template>
  <!-- Missing / Invalid Token State -->
  <div
    v-if="!hasToken"
    class="w-full flex flex-col items-center justify-center gap-4 text-center py-2">
    <div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
      <i class="pi pi-exclamation-triangle text-4xl" />
    </div>
    <div class="flex flex-col gap-1">
      <h3 class="text-xl font-bold text-surface-900 dark:text-white">
        ไม่พบโทเค็นสำหรับรีเซ็ตรหัสผ่าน
      </h3>
      <p class="text-sm text-surface-500 dark:text-surface-400">
        ไม่พบโทเค็นสำหรับการรีเซ็ตรหัสผ่าน กรุณากดลิงก์จากอีเมลที่คุณได้รับ หรือขอรับลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง
      </p>
    </div>
    <div class="w-full flex flex-col gap-2 mt-2">
      <Button
        label="ขอรีเซ็ตรหัสผ่านใหม่"
        pt:label:class="font-bold"
        pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
        @click="goToForgotPassword" />
      <Button
        label="กลับไปยังหน้าเข้าสู่ระบบ"
        pt:root:class="rounded-xl py-3 w-full"
        severity="secondary"
        variant="outlined"
        @click="goToLogin" />
    </div>
  </div>

  <!-- Form State -->
  <form
    v-else
    @submit.prevent="resetPassword">
    <InputPasswordField
      v-model="form.newPassword"
      :rules="formRules.newPassword"
      :show-error="submitted"
      label="รหัสผ่านใหม่"
      placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
      required />

    <CheckPasswordStrength :password="form.newPassword" />

    <InputPasswordField
      v-model="form.confirmNewPassword"
      :rules="formRules.confirmNewPassword"
      :show-error="submitted"
      label="ยืนยันรหัสผ่านใหม่"
      placeholder="กรอกยืนยันรหัสผ่านใหม่อีกครั้ง"
      required />

    <Button
      label="รีเซ็ตรหัสผ่าน"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />

    <NuxtLink
      :to="{ name: 'auth-login' }"
      class="text-center text-sm text-surface-500 hover:text-primary transition-colors">
      กลับไปยังหน้าเข้าสู่ระบบ
    </NuxtLink>
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import InputPasswordField from '~/components/input/InputPasswordField.vue'
import CheckPasswordStrength from '~/components/input/CheckPasswordStrength.vue'
import type { IResetPasswordPayload } from '~/models/request/AuthReq.model'
import { validate, validateForm } from '~/plugins/Validate'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

definePageMeta({
  title: 'รีเซ็ตรหัสผ่าน',
  description: 'กรอกรหัสผ่านใหม่ของคุณเพื่อรีเซ็ตรหัสผ่าน',
  backPath: { name: 'auth-login' }
})

const authService: IAuthProvider = new AuthProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const submitted = ref(false)

const token = computed((): string => {
  const t = route.query.token || route.query.accessToken
  return Array.isArray(t) ? t[0] ?? '' : (t as string) ?? ''
})

const hasToken = computed((): boolean => Boolean(token.value.trim()))

const form = ref<Omit<IResetPasswordPayload, 'token'>>({
  newPassword: '',
  confirmNewPassword: ''
})

const formRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  newPassword: [
    validate.required,
    (val: string): boolean | string => val.length >= 6 || 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
    (val: string): boolean | string => val.length <= 100 || 'รหัสผ่านต้องมีความยาวไม่เกิน 100 ตัวอักษร'
  ],
  confirmNewPassword: [
    validate.required,
    (val: string): boolean | string => validate.confirmPassword(val, form.value.newPassword)
  ]
}))

async function onResetPassword (): Promise<void> {
  const payload: IResetPasswordPayload = {
    token: token.value,
    newPassword: form.value.newPassword,
    confirmNewPassword: form.value.confirmNewPassword
  }

  await authService.resetForgotPassword(payload)

  toast.add({
    severity: 'success',
    summary: 'รีเซ็ตรหัสผ่านสำเร็จ',
    detail: 'ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่',
    life: 5000
  })

  router.push({ name: 'auth-login', query: { from: 'reset-forgot-password' } })
}

function resetPassword (): void {
  submitted.value = true
  if (!validateForm(form.value, formRules.value)) {
    return
  }

  $handleLoading(onResetPassword, {
    toast: {
      instance: toast
    }
  })
}

function goToForgotPassword (): void {
  router.push({ name: 'auth-forgot-password' })
}

function goToLogin (): void {
  router.push({ name: 'auth-login' })
}
</script>

<style scoped>
</style>
