import { onMounted, watch } from 'vue'
import { tryRefreshToken, clearPersistedAuth } from '~/utils/authRefresh'
import { useAuthStore } from '~/stores/Auth'

let intervalId: any = null

export function startTokenRefreshTimer (router: any): void {
  if (import.meta.server) return
  if (intervalId) return

  const authStore = useAuthStore()

  const checkAndRefresh = async (): Promise<void> => {
    const hasTokenData
      = !!authStore.userToken.accessToken
        && !!authStore.userToken.refreshToken
        && authStore.userToken.tokenExpiresIn !== null

    if (!hasTokenData) return

    try {
      const isSuccess = await tryRefreshToken({ showSpinner: false })
      if (!isSuccess) {
        clearPersistedAuth()
        authStore.logout()
        router.push({ name: 'auth-verify' })
      }
    } catch (err: any) {
      console.error('[TokenRefresh] Error in background timer:', err)
    }
  }

  void checkAndRefresh()
  intervalId = setInterval((): void => {
    void checkAndRefresh()
  }, 60000)
}

export function stopTokenRefreshTimer (): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

export function useTokenRefresh (): void {
  const router = useRouter()
  const authStore = useAuthStore()

  onMounted((): void => {
    const hasTokenData = !!authStore.userToken.accessToken
    if (hasTokenData) {
      startTokenRefreshTimer(router)
    }
  })

  watch((): string => authStore.userToken.accessToken, (newToken: string): void => {
    if (newToken) {
      startTokenRefreshTimer(router)
    } else {
      stopTokenRefreshTimer()
    }
  })
}
