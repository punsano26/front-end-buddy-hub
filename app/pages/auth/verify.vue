<template>
  <form @submit.prevent="onSubmit">
    <InputLabelField
      v-model="account"
      :rules="[validate.required]"
      :show-error="submitted"
      label="อีเมลหรือชื่อผู้ใช้"
      placeholder="อีเมลหรือชื่อผู้ใช้"
      required />
    <Button
      label="ถัดไป"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import InputLabelField from '~/components/input/InputLabelField.vue'
import { validate } from '~/plugins/Validate'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'
import Button from '~/volt/Button.vue'

definePageMeta({
  title: 'เข้าสู่ระบบ',
  description: 'กรอกอีเมลหรือชื่อผู้ใช้ของคุณเพื่อเข้าสู่ระบบ'
})

const authService: IAuthProvider = new AuthProvider()
const router = useRouter()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const account = ref<string>('')

const submitted = ref(false)

async function onVerify (): Promise<void> {
  if (!account.value) return
  const payload = {
    account: account.value
  }
  const response = await authService.checkAuth(payload)
  router.push({
    name: response.data.isExisting ? 'auth-login' : 'auth-register',
    query: {
      account: account.value
    }
  })
}

function onSubmit (): void {
  submitted.value = true
  if (!account.value.trim()) {
    return
  }
  $handleLoading(onVerify, {
    toast: {
      instance: toast
    }
  })
}
</script>
