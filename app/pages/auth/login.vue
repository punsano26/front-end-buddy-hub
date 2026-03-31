<template>
  <form @submit.prevent="login">
    <InputLabelField
      v-model="form.account"
      :disabled="!!route.query.account"
      label="อีเมลหรือชื่อผู้ใช้"
      placeholder="กรอกอีเมลหรือชื่อผู้ใช้ของคุณ"
      required />
    <InputLabelField label="รหัสผ่าน">
      <InputPasswordField v-model="form.password" />
    </InputLabelField>
    <Button
      label="เข้าสู่ระบบ"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
    <NuxtLink
      :to="{ name: 'auth-forgot-password', query: { from: 'login' } }"
      class="text-center text-blue-400">
      ลืมรหัสผ่าน ?
    </NuxtLink>
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import InputLabelField from '~/components/input/InputLabelField.vue'
import InputPasswordField from '~/components/input/InputPasswordField.vue'
import type { IAuthLoginPayload } from '~/models/request/AuthReq.model'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

const authService: IAuthProvider = new AuthProvider()
const route = useRoute()
const toast = useToast()

const router = useRouter()
const authStore = useAuthStore()
const { $handleLoading } = useNuxtApp()

definePageMeta({
  title: 'เข้าสู่ระบบเพื่อใช้งาน',
  backPath: { name: 'auth-verify' }
})

const form = ref<IAuthLoginPayload>({
  account: Array.isArray(route.query.account)
    ? route.query.account[0] ?? ''
    : route.query.account ?? '',
  password: ''
})

async function onLogin (): Promise<void> {
  if (!form.value.account || !form.value.password) return
  const payload = {
    account: form.value.account,
    password: form.value.password
  }
  const response = await authService.login(payload)
  authStore.userLogin(response.data, response.accessToken, response.refreshToken, Number(response.tokenExpireIn))

  router.push({ name: 'public-home' })
}

function login (): void {
  $handleLoading(onLogin, {
    toast: {
      instance: toast
    }
  })
}

onBeforeMount((): void => {
  if (route.query.account || route.query.from === 'reset-forgot-password') return
  router.replace({ name: 'auth-verify' })
})
</script>

<style scoped>

</style>
