import type { RouteLocationNormalized } from 'vue-router'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  // Tokens are stored in localStorage, so skip auth checks during SSR.
  if (import.meta.server) return

  const authService: IAuthProvider = new AuthProvider()
  const authStore = useAuthStore()
  const { $handleLoading } = useNuxtApp()

  hydrateTokenFromLocalStorage()

  const isAuthPath = to.path.startsWith('/auth')
  const isPublicHome = to.path === '/public/home'
  const isLandingPage = to.path === '/'
  const hasTokenData
    = !!authStore.userToken.accessToken
      && !!authStore.userToken.refreshToken
      && authStore.userToken.tokenExpireIn !== null

  // 🔒 If not an auth path, not the public home page, and no valid token, redirect to verification.
  if (!isAuthPath && !isPublicHome && !hasTokenData && !isLandingPage) {
    return navigateTo('/auth/verify') as any
  }

  // 🔄 If logged in and not on an auth path, refresh the token.
  if (hasTokenData && !isAuthPath) {
    await $handleLoading(resetToken)
  }

  function hydrateTokenFromLocalStorage (): void {
    // Correctly check if all parts of the token are already in the store.
    if (
      authStore.userToken.accessToken
      && authStore.userToken.refreshToken
      && authStore.userToken.tokenExpireIn !== null
    ) {
      return
    }

    const persistedAuth = localStorage.getItem('Auth')
    if (!persistedAuth) return

    try {
      const parsedAuth = JSON.parse(persistedAuth)
      const persistedToken = parsedAuth?.userToken

      if (!persistedToken) return

      authStore.userToken.accessToken = persistedToken.accessToken || ''
      authStore.userToken.refreshToken = persistedToken.refreshToken || ''
      authStore.userToken.tokenExpireIn = persistedToken.tokenExpireIn ?? null
    } catch {
      // Ignore invalid persisted format and continue with current store state.
    }
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
