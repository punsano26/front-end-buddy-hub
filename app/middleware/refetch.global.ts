import type { RouteLocationNormalized } from 'vue-router'
// import { useToast } from 'primevue/usetoast'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  if (to.path.startsWith('/public')) {
    const authService: IAuthProvider = new AuthProvider()
    const authStore = useAuthStore()
    const { $handleLoading } = useNuxtApp()
    // const toast = useToast()

    await $handleLoading(resetToken, {
      // toast: {
      //   instance: toast
      // }
    })
    async function resetToken (): Promise<void> {
      if (!authStore.userToken.refreshToken) return
      const payload = {
        refreshToken: authStore.userToken.refreshToken
      }
      const response = await authService.refreshToken(payload)
      authStore.userToken.accessToken = response.accessToken
      authStore.userToken.refreshToken = response.refreshToken
      authStore.userToken.tokenExpireIn = response.tokenExpireIn
    }
  }
})
