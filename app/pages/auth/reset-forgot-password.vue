<template>
  <form @submit.prevent="resetPassword">
    <InputLabelField
      v-model="form.newPassword"
      :show-error="submitted"
      label="รหัสผ่านใหม่"
      placeholder="กรอกรหัสผ่านใหม่"
      type="password"
      required />
    <CheckPasswordStrength :password="form.newPassword" />
    <InputLabelField
      v-model="form.confirmNewPassword"
      :rules="[validate.required, (val: string) => validate.confirmPassword(val, form.newPassword)]"
      :show-error="submitted"
      label="ยืนยันรหัสผ่าน"
      placeholder="ยืนยันรหัสผ่าน"
      type="password"
      required />
    <Button
      label="รีเซ็ตรหัสผ่าน"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { IResetPasswordPayload } from '~/models/request/AuthReq.model'
import { validate } from '~/plugins/Validate'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

const authService: IAuthProvider = new AuthProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
// const route = useRoute()
const submitted = ref(false)
const router = useRouter()
definePageMeta({
  title: 'รีเซ็ตรหัสผ่าน',
  description: 'กรอกรหัสผ่านใหม่ของคุณเพื่อรีเซ็ตรหัสผ่าน'
})
const form = ref<IResetPasswordPayload>({
  newPassword: '',
  confirmNewPassword: ''
})

async function onResetPassword (): Promise<void> {
  if (form.value.newPassword !== form.value.confirmNewPassword) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'รหัสผ่านไม่ตรงกัน'
    })
    return
  }
  const payload = {
    newPassword: form.value.newPassword,
    confirmNewPassword: form.value.confirmNewPassword
  }
  await authService.resetForgotPassword(payload)
  router.push({ name: 'auth-login', query: { from: 'reset-forgot-password' } })
}

function resetPassword (): void {
  submitted.value = true
  if (!form.value.newPassword.trim() || !form.value.confirmNewPassword.trim()) {
    return
  }
  $handleLoading(onResetPassword, {
    toast: {
      instance: toast
    }
  })
}
</script>

<style scoped>

</style>
