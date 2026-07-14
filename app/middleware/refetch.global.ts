import type { RouteLocationNormalized } from 'vue-router'
import { tryRefreshToken, clearPersistedAuth } from '~/utils/authRefresh'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized): Promise<void> => {
  // Tokens are stored in localStorage, so skip auth checks during SSR.
  if (import.meta.server) return

  const authStore = useAuthStore()
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
    const isRefreshSuccess = await tryRefreshToken({ showSpinner: true })

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
})
