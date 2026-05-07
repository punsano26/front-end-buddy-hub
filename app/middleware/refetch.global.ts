import type { RouteLocationNormalized } from 'vue-router'
import AuthProvider, { type IAuthProvider } from '~/resource/provider/Auth.provider'

const REFRESH_BUFFER_MS = 2 * 60 * 1000
let refreshLock: Promise<boolean> | null = null

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  // Tokens are stored in localStorage, so skip auth checks during SSR.
  if (import.meta.server) return

  const authService: IAuthProvider = new AuthProvider()
  const authStore = useAuthStore()
  const { $handleLoading } = useNuxtApp()
  hydrateTokenFromLocalStorage()

  const isAuthPath = to.path.startsWith('/auth')
  const isPolicyPath = to.path === '/policy' || to.path.startsWith('/policy/')
  const isPublicHome = to.path === '/public/home'
  const isLandingPage = to.path === '/'
  const hasTokenData
    = !!authStore.userToken.accessToken
      && !!authStore.userToken.refreshToken
      && authStore.userToken.tokenExpiresIn !== null

  // 🔒 If not a public path and no valid token, redirect to verification.
  if (!isAuthPath && !isPolicyPath && !isPublicHome && !hasTokenData && !isLandingPage) {
    return navigateTo('/auth/verify') as any
  }

  const isProtectedPath = !isAuthPath && !isPolicyPath && !isPublicHome && !isLandingPage

  // 🔄 Refresh token only on protected pages.
  if (hasTokenData && isProtectedPath) {
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
      && authStore.userToken.tokenExpiresIn !== null
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
      authStore.userToken.tokenExpiresIn = persistedToken.tokenExpiresIn ?? null
    } catch {
      // Ignore invalid persisted format and continue with current store state.
    }
  }

  async function resetToken (): Promise<boolean> {
    if (!authStore.userToken.refreshToken) return false

    const payload = {
      refreshToken: authStore.userToken.refreshToken
    }

    const response = await authService.refreshToken(payload)

    authStore.userToken.accessToken = response.accessToken
    authStore.userToken.refreshToken = response.refreshToken
    authStore.userToken.tokenExpiresIn = response.tokenExpiresIn

    return true
  }

  async function tryRefreshToken (): Promise<boolean> {
    if (refreshLock) {
      return await refreshLock
    }

    if (!shouldRefreshToken()) return true

    refreshLock = (async (): Promise<boolean> => {
      try {
        const result = await $handleLoading(resetToken)
        return result === true
      } catch {
        return false
      } finally {
        refreshLock = null
      }
    })()

    return await refreshLock
  }

  function shouldRefreshToken (): boolean {
    const tokenExpiresIn = authStore.userToken.tokenExpiresIn

    if (!tokenExpiresIn || tokenExpiresIn <= 0) return false

    const now = Date.now()
    const expireAtMs = normalizeExpireAtMs(tokenExpiresIn, now)

    if (!expireAtMs) return false

    return expireAtMs - now <= REFRESH_BUFFER_MS
  }

  function normalizeExpireAtMs (tokenExpiresIn: number, now: number): number | null {
    if (!Number.isFinite(tokenExpiresIn) || tokenExpiresIn <= 0) return null

    if (tokenExpiresIn > 1_000_000_000_000) {
      return tokenExpiresIn
    }

    if (tokenExpiresIn > 1_000_000_000) {
      return tokenExpiresIn * 1000
    }

    return now + tokenExpiresIn * 1000
  }

  function clearPersistedAuth (): void {
    localStorage.removeItem('Auth')
  }
})
