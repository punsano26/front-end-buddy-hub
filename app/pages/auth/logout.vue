<template>
  <div />
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

const authService: IAuthProvider = new AuthProvider()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { $handleLoading } = useNuxtApp()

const payload = {
  refreshToken: authStore.userToken.refreshToken
}
async function onLogout (): Promise<void> {
  await authService.refreshToken(payload)
  await authService.logout()
  authStore.logout()
  router.push({ name: 'public-home' })
}

onMounted((): void => {
  $handleLoading(onLogout, {
    toast: {
      instance: toast,
      success: {
        summary: 'ออกจากระบบสำเร็จ'
      }
    }
  })
})
</script>

<style scoped>

</style>
