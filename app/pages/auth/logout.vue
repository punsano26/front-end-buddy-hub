<template>
  <div class="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-background z-50">
    <ProgressSpinner
      class="w-16 h-16"
      stroke-width="4" />
    <p class="text-surface-400 text-sm animate-pulse">
      กำลังออกจากระบบ...
    </p>
  </div>
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

definePageMeta({
  layout: false
})

async function onLogout (): Promise<void> {
  // 1. Close WebSocket connection immediately for instant offline status
  const { $ws } = useNuxtApp()
  const socket = $ws?.()
  if (socket) {
    (socket as WebSocket & { __manualClose?: boolean }).__manualClose = true
    socket.close()
  }

  // 2. Call backend session revocation (using access token before it is cleared)
  try {
    await authService.logout()
  } catch (err: any) {
    console.error('[Logout] Failed to revoke session on backend:', err)
  }

  // 3. Clear auth store and redirect
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
