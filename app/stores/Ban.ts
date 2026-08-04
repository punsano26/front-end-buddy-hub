import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/Auth'
import { clearPersistedAuth } from '~/utils/authRefresh'

export interface IBanEventData {
  reason: string
  expiresAt: string | null
  banDuration: 'FIFTEEN' | 'THIRTY' | 'PERMANENT' | string
}

interface IBanStore {
  isBannedModalVisible: Ref<boolean>
  banInfo: Ref<IBanEventData | null>
  banMessage: Ref<string>
  formattedExpiresAt: ComputedRef<string>
  setBanInfo (info: IBanEventData): void
  showBanAlert (message: string): void
  hideBannedModal (): void
  triggerForceLogout (info?: IBanEventData | string): Promise<void>
}

export const useBanStore = defineStore('Ban', (): IBanStore => {
  const isBannedModalVisible = ref<boolean>(false)
  const banInfo = ref<IBanEventData | null>(null)
  const banMessage = ref<string>('')

  const formattedExpiresAt = computed<string>((): string => {
    if (!banInfo.value) return ''
    if (banInfo.value.banDuration === 'PERMANENT' || !banInfo.value.expiresAt) {
      return 'ถาวร (PERMANENT)'
    }

    try {
      const date = new Date(banInfo.value.expiresAt)
      if (isNaN(date.getTime())) {
        return banInfo.value.expiresAt
      }
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return banInfo.value.expiresAt || ''
    }
  })

  function setBanInfo (info: IBanEventData): void {
    banInfo.value = info
    banMessage.value = info.reason || 'บัญชีของคุณถูกระงับการใช้งาน'
    isBannedModalVisible.value = true
  }

  function showBanAlert (message: string): void {
    banMessage.value = message
    if (!banInfo.value) {
      banInfo.value = {
        reason: message,
        expiresAt: null,
        banDuration: 'PERMANENT'
      }
    }
    isBannedModalVisible.value = true
  }

  function hideBannedModal (): void {
    isBannedModalVisible.value = false
  }

  /**
   * Triggers the Force Logout Flow:
   * 1. Display prominent modal / state with reason and expiresAt.
   * 2. Clear all stored auth credentials (tokens, user state, localStorage/sessionStorage).
   * 3. Disconnect WebSocket client connection.
   * 4. Redirect user to /login or /auth/login.
   */
  async function triggerForceLogout (info?: IBanEventData | string): Promise<void> {
    if (typeof info === 'string') {
      showBanAlert(info)
    } else if (info) {
      setBanInfo(info)
    } else if (!banInfo.value) {
      showBanAlert('บัญชีของคุณถูกระงับการใช้งาน')
    }

    // 1. Close WebSocket connection immediately
    try {
      const { $ws } = useNuxtApp() as any
      const socket = $ws?.()
      if (socket) {
        (socket as WebSocket & { __manualClose?: boolean }).__manualClose = true
        socket.close()
      }
    } catch (err: any) {
      console.error('[BanStore] Error closing socket:', err)
    }

    // 2. Clear all stored authentication credentials
    try {
      clearPersistedAuth()
      const authStore = useAuthStore()
      authStore.logout()

      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
    } catch (err: any) {
      console.error('[BanStore] Error clearing storage:', err)
    }

    // 3. Redirect to login or notice page
    try {
      const router = useNuxtApp().$router
      if (router) {
        const queryParams: Record<string, string> = { banned: 'true' }
        if (typeof info === 'string') {
          queryParams.reason = info
        } else if (info?.reason) {
          queryParams.reason = info.reason
          if (info.expiresAt) {
            queryParams.expiresAt = info.expiresAt
          }
          if (info.banDuration) {
            queryParams.banDuration = info.banDuration
          }
        }

        void router.push({
          name: 'auth-login',
          query: queryParams
        })
      }
    } catch (err: any) {
      console.error('[BanStore] Error navigating to login page:', err)
    }
  }

  return {
    isBannedModalVisible,
    banInfo,
    banMessage,
    formattedExpiresAt,
    setBanInfo,
    showBanAlert,
    hideBannedModal,
    triggerForceLogout
  }
})

export default { useBanStore }
