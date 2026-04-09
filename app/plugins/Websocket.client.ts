import { watch } from 'vue'
import { useAuthStore } from '~/stores/Auth'
import { useUserStore } from '~/stores/User'

export default defineNuxtPlugin((): any => {
  const authStore = useAuthStore()

  let ws: (WebSocket & { __manualClose?: boolean }) | null = null

  const connect = (): void => {
    const token = authStore.userToken.accessToken

    if (!token) return

    ws = new WebSocket(
      `wss://buddy-hub-backend-j36s.onrender.com/ws?token=${token}`
    ) as WebSocket & { __manualClose?: boolean }

    ws.onopen = (): void => {
      console.log('WS connected')
    }

    ws.onmessage = (event: MessageEvent): void => {
      const data = JSON.parse(event.data)
      const userStore = useUserStore()

      if (data.event === 'users:update' || data.event === 'users:list' || data.event === 'users:paginate:response') {
        const incoming = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.users)
            ? data.data.users
            : Array.isArray(data.users)
              ? data.users
              : data.data && typeof data.data === 'object'
                ? Object.values(data.data)
                : []

        userStore.setUsers(incoming)
      }

      if (data.event === 'user:detail' || data.event === 'user:detail:response' || data.event === 'users:detail:update') {
        const detail = data.data?.user ?? data.user ?? data.data
        userStore.setUserDetail(detail)
      }
    }

    ws.onclose = (): void => {
      console.log('WS disconnected')

      const wasManualClose = ws?.__manualClose === true
      ws = null

      if (wasManualClose) return

      setTimeout((): void => {
        connect()
      }, 3000)
    }
  }

  watch((): string => authStore.userToken.accessToken, (token: string): void => {
    if (token && (!ws || ws.readyState === WebSocket.CLOSED)) {
      connect()
    }
  }, { immediate: true })

  return {
    provide: {
      ws: (): any => ws
    }
  }
})
