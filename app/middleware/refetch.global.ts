import type { RouteLocationNormalized } from 'vue-router'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  const authService: IAuthProvider = new AuthProvider()
  const authStore = useAuthStore()
  const { $handleLoading } = useNuxtApp()

  const isPublicPath = to.path.startsWith('/public')
  const isHome = to.path === '/public/home'
  const isLoggedIn = !!authStore.userToken.accessToken

  // 🔒 ถ้าเป็น public แต่ไม่ใช่ home และยังไม่ได้ login → เด้ง
  if (isPublicPath && !isHome && !isLoggedIn) {
    return navigateTo('/auth/verify') as any
  }

  // 🔄 ถ้าเป็น public และ login แล้ว → refresh token
  if (isPublicPath && isLoggedIn) {
    await $handleLoading(resetToken)
  }

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
})
