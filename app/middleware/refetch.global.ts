import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

export default defineNuxtRouteMiddleware(
  async (to: RouteLocationNormalized): Promise<NavigationGuardReturn> => {
    const authService: IAuthProvider = new AuthProvider()
    const authStore = useAuthStore()

    const isPublicHome = to.path === '/public/home'
    const isAuthPage = to.path.startsWith('/auth')

    if (isPublicHome || isAuthPage) return

    if (!authStore.userToken.refreshToken) {
      return navigateTo('/auth/verify')
    }

    try {
      const payload = {
        refreshToken: authStore.userToken.refreshToken
      }
      const res = await authService.refreshToken(payload)

      authStore.userToken.accessToken = res.accessToken
      authStore.userToken.refreshToken = res.refreshToken
    } catch {
      authStore.logout()
      return navigateTo('/auth/verify')
    }
  }
)
