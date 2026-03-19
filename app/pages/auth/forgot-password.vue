<template>
  <form @submit.prevent="forgotPasswordRequest">
    <InputLabelField
      v-model="form.email"
      label="อีเมล"
      placeholder="กรอกอีเมลของคุณ"
      required />
    <InputLabelField
      v-model="form.username"
      label="ชื่อผู้ใช้"
      placeholder="กรอกชื่อผู้ใช้ของคุณ"
      required />
    <Button
      label="ส่งคำขอรีเซ็ตรหัสผ่าน"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { IForgotPasswordPayload } from '~/models/request/AuthReq.model'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

const authService: IAuthProvider = new AuthProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const route = useRoute()
const router = useRouter()
definePageMeta({
  title: 'ลืมรหัสผ่าน',
  description: 'กรอกอีเมลหรือชื่อผู้ใช้ของคุณเพื่อขอรีเซ็ตรหัสผ่าน'
})

const form = ref<IForgotPasswordPayload>({
  email: '',
  username: ''
})

async function onCheckEmailUsername (): Promise<void> {
  if (!form.value.email || !form.value.username) return
  const payload = {
    email: form.value.email,
    username: form.value.username
  }
  await authService.forgotPassword(payload)

  router.push({ name: 'auth-reset-forgot-password' })
}

function forgotPasswordRequest (): void {
  if (!form.value.email.trim() || !form.value.username.trim()) {
    return
  }
  $handleLoading(onCheckEmailUsername, {
    toast: {
      instance: toast
    }
  })
}

onBeforeMount((): void => {
  if (route.query.from !== 'login') {
    router.replace({ name: 'auth-verify' })
  }
})
</script>

<style scoped>

</style>
