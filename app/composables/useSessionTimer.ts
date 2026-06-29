import { ref, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'
import RentCustomerProvider from '~/resource/provider/RentCustomer.provider'

export interface IUseSessionTimer {
  remainingSeconds: Ref<number>
  completingSeconds: Ref<number>
  isExpired: Ref<boolean>
  isWarning: ComputedRef<boolean>
  hasError: Ref<boolean>
  syncWithServer: () => Promise<void>
}

export function useSessionTimer (sessionId: number): IUseSessionTimer {
  const rentProvider = new RentCustomerProvider()
  const { $ws } = useNuxtApp()

  const remainingSeconds = ref<number>(0)
  const completingSeconds = ref<number>(0)
  const isExpired = ref<boolean>(false)
  const isWarning = computed((): boolean => remainingSeconds.value < 60 && remainingSeconds.value > 0)
  const hasError = ref<boolean>(false)

  let timerInterval: any = null
  let socketSyncInterval: any = null
  const currentSocket = ref<WebSocket | null>(null)
  const wsListener = ref<((event: MessageEvent) => void) | null>(null)

  async function syncWithServer (): Promise<void> {
    try {
      const response = await rentProvider.findRealtimeSessionMessages(sessionId)
      if (response?.data) {
        remainingSeconds.value = response.data.sessionRemainingSeconds ?? 0
        completingSeconds.value = response.data.completingRemainingSeconds ?? 0
        isExpired.value = remainingSeconds.value <= 0
        hasError.value = false
      } else {
        hasError.value = true
      }
    } catch (error) {
      hasError.value = true
      console.error('Failed to sync session timer with server:', error)
    }
  }

  function startCountdown (): void {
    stopCountdown()
    timerInterval = setInterval((): void => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--
        if (remainingSeconds.value <= 0) {
          isExpired.value = true
        }
      } else {
        isExpired.value = true
      }

      if (completingSeconds.value > 0) {
        completingSeconds.value--
      }
    }, 1000)
  }

  function stopCountdown (): void {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function removeSocketListener (): void {
    if (currentSocket.value && wsListener.value) {
      currentSocket.value.removeEventListener('message', wsListener.value)
    }
    currentSocket.value = null
    wsListener.value = null
  }

  function setupSocketListener (): void {
    const socket = $ws() as WebSocket | null
    if (!socket) {
      removeSocketListener()
      return
    }

    if (currentSocket.value === socket && wsListener.value) return

    removeSocketListener()

    const onMessage = (event: MessageEvent): void => {
      let payload: any
      try {
        payload = JSON.parse(event.data)
      } catch {
        return
      }

      if (!payload || typeof payload.event !== 'string') return

      const data = payload.data
      const getSessionId = (d: any): number | null => {
        if (!d) return null
        if (typeof d === 'number') return d
        if (typeof d === 'string') return Number(d)
        const val = d.sessionId || d.session_id || d.hireSessionId || d.hire_session_id || d.id
        return val ? Number(val) : null
      }

      const incomingId = getSessionId(data) || getSessionId(payload)
      if (incomingId !== sessionId) return

      switch (payload.event) {
        case 'session_timer_sync': {
          if (data) {
            if (typeof data.sessionRemainingSeconds === 'number') {
              remainingSeconds.value = data.sessionRemainingSeconds
            }
            isExpired.value = remainingSeconds.value <= 0
          }
          break
        }
        case 'session_started': {
          if (data) {
            if (typeof data.sessionRemainingSeconds === 'number') {
              remainingSeconds.value = data.sessionRemainingSeconds
            } else if (data.expiresAt) {
              const expiryTime = new Date(data.expiresAt).getTime()
              remainingSeconds.value = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000))
            }
            isExpired.value = remainingSeconds.value <= 0
            startCountdown()
          }
          break
        }
        case 'session_expired': {
          remainingSeconds.value = 0
          isExpired.value = true
          stopCountdown()
          break
        }
        case 'session_expiry_status': {
          if (data) {
            if (data.expired) {
              remainingSeconds.value = 0
              isExpired.value = true
              stopCountdown()
            }
          }
          break
        }
        default: {
          break
        }
      }
    }

    socket.addEventListener('message', onMessage)
    currentSocket.value = socket
    wsListener.value = onMessage
  }

  function startSocketSync (intervalMs: number = 1000): void {
    stopSocketSync()
    setupSocketListener()
    socketSyncInterval = setInterval((): void => {
      setupSocketListener()
    }, intervalMs)
  }

  function stopSocketSync (): void {
    if (socketSyncInterval) {
      clearInterval(socketSyncInterval)
      socketSyncInterval = null
    }
  }

  onMounted(async (): Promise<void> => {
    await syncWithServer()
    startCountdown()
    startSocketSync()
  })

  onBeforeUnmount((): void => {
    stopCountdown()
    stopSocketSync()
    removeSocketListener()
  })

  return {
    remainingSeconds,
    completingSeconds,
    isExpired,
    isWarning,
    hasError,
    syncWithServer
  }
}

export default useSessionTimer
