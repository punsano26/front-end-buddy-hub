import type { RouteLocationNormalized } from 'vue-router'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  // Tokens are stored in localStorage, so skip auth checks during SSR.
  if (import.meta.server) return

  const TOKEN_REFRESH_BUFFER_MS = 60 * 1000

  const authService: IAuthProvider = new AuthProvider()
  const authStore = useAuthStore()

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

  const isProtectedPath = !isAuthPath && !isPublicHome && !isLandingPage

  // 🔄 Refresh token only on protected pages when current token is close to expiring.
  if (hasTokenData && isProtectedPath && shouldRefreshToken()) {
    const isRefreshSuccess = await tryRefreshToken()

    if (!isRefreshSuccess) {
      clearPersistedAuth()
      authStore.logout()

      return navigateTo('/auth/verify') as any
    }
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
      authStore.userToken.tokenExpireIn = normalizeTokenExpireIn(persistedToken.tokenExpireIn)
    } catch {
      // Ignore invalid persisted format and continue with current store state.
    }
  }

  function shouldRefreshToken (): boolean {
    const tokenExpireIn = authStore.userToken.tokenExpireIn

    if (tokenExpireIn === null) return false

    return tokenExpireIn <= Date.now() + TOKEN_REFRESH_BUFFER_MS
  }

  function normalizeTokenExpireIn (tokenExpireIn: unknown): number | null {
    if (tokenExpireIn === null || tokenExpireIn === undefined) {
      return null
    }

    const parsedTokenExpireIn = Number(tokenExpireIn)
    return Number.isFinite(parsedTokenExpireIn) ? parsedTokenExpireIn : null
  }

  async function resetToken (): Promise<void> {
    if (!authStore.userToken.refreshToken) return

    const payload = {
      refreshToken: authStore.userToken.refreshToken
    }

    const response = await authService.refreshToken(payload)

    authStore.userToken.accessToken = response.accessToken
    authStore.userToken.refreshToken = response.refreshToken
    authStore.userToken.tokenExpireIn = normalizeTokenExpireIn(response.tokenExpireIn)
  }

  async function tryRefreshToken (): Promise<boolean> {
    try {
      await resetToken()
      return true
    } catch {
      return false
    }
  }

  function clearPersistedAuth (): void {
    localStorage.removeItem('Auth')
  }
})
