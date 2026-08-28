<template>
  <!-- Success state -->
  <div
    v-if="isSubmittedSuccess"
    class="w-full flex flex-col items-center justify-center gap-4 text-center py-2">
    <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
      <i class="pi pi-envelope text-4xl" />
    </div>
    <div class="flex flex-col gap-1">
      <h3 class="text-xl font-bold text-surface-900 dark:text-white">
        ส่งคำขอรีเซ็ตรหัสผ่านแล้ว
      </h3>
      <p class="text-sm text-surface-500 dark:text-surface-400">
        ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมล <span class="font-bold text-surface-900 dark:text-surface-100">{{ form.email }}</span> เรียบร้อยแล้ว กรุณาตรวจสอบกล่องข้อความหรืออีเมลขยะของคุณ
      </p>
    </div>
    <div class="w-full flex flex-col gap-2 mt-2">
      <Button
        label="กลับไปยังหน้าเข้าสู่ระบบ"
        pt:label:class="font-bold"
        pt:root:class="bg-gradient-primary border-none rounded-xl py-3 w-full"
        @click="goToLogin" />
      <Button
        label="ส่งคำขออีกครั้ง"
        pt:root:class="rounded-xl py-3 w-full"
        severity="secondary"
        variant="outlined"
        @click="isSubmittedSuccess = false" />
    </div>
  </div>

  <!-- Form state -->
  <form
    v-else
    @submit.prevent="forgotPasswordRequest">
    <InputLabelField
      v-model="form.email"
      :rules="formRules.email"
      :show-error="submitted"
      label="อีเมล"
      placeholder="กรอกอีเมลของคุณ"
      required />
    <InputLabelField
      v-model="form.username"
      :rules="formRules.username"
      :show-error="submitted"
      label="ชื่อผู้ใช้"
      placeholder="กรอกชื่อผู้ใช้ของคุณ"
      required />
    <Button
      label="ส่งคำขอรีเซ็ตรหัสผ่าน"
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
import type { IForgotPasswordPayload } from '~/models/request/AuthReq.model'
import { validate, validateForm } from '~/plugins/Validate'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

definePageMeta({
  title: 'ลืมรหัสผ่าน',
  description: 'กรอกอีเมลและชื่อผู้ใช้ของคุณเพื่อขอรีเซ็ตรหัสผ่าน',
  backPath: { name: 'auth-login' }
})

const authService: IAuthProvider = new AuthProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const router = useRouter()

const submitted = ref(false)
const isSubmittedSuccess = ref(false)

const form = ref<IForgotPasswordPayload>({
  email: '',
  username: ''
})

const formRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  email: [validate.required, validate.email],
  username: [validate.required]
}))

async function onSendForgotPasswordRequest (): Promise<void> {
  const payload: IForgotPasswordPayload = {
    email: form.value.email.trim(),
    username: form.value.username.trim()
  }
  const response = await authService.forgotPassword(payload)
  isSubmittedSuccess.value = true
  toast.add({
    severity: 'success',
    summary: 'ส่งคำขอสำเร็จ',
    detail: response?.message || 'ส่งคำแนะนำการรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว',
    life: 5000
  })
}

function forgotPasswordRequest (): void {
  submitted.value = true
  if (!validateForm(form.value, formRules.value)) {
    return
  }
  $handleLoading(onSendForgotPasswordRequest, {
    toast: {
      instance: toast
    }
  })
}

function goToLogin (): void {
  router.push({ name: 'auth-login' })
}
</script>

<style scoped>
</style>
