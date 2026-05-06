import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAuthLoginData } from '~/models/response/AuthRes.model'

interface IUser extends IAuthLoginData {}

interface IToken {
  accessToken: string
  refreshToken: string
  tokenExpireIn: number | null
}

interface IResetToken {
  resetPasswordToken: string
}

interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  resetToken: Ref<IResetToken>
  userLogin(user: IUser, accessToken: string, refreshToken: string, tokenExpireIn: number): void
  resetPassword(token: IResetToken): void
  updateUser (userValue: IUser): void
  logout (): void
}

export const useAuthStore = defineStore('Auth', (): IAuthStore => {
  const user = ref<IUser>({
    id: 0,
    username: '',
    profileImg: null,
    roles: []
  })

  const userToken = ref<IToken>({
    accessToken: '',
    refreshToken: '',
    tokenExpireIn: null
  })

  const resetPasswordToken = ref<IResetToken>({
    resetPasswordToken: ''
  })

  function userLogin (userValue: IUser, accessToken: string, refreshToken: string, tokenExpireIn: number): void {
    user.value = userValue
    userToken.value = {
      accessToken,
      refreshToken,
      tokenExpireIn
    }

    if (import.meta.client) {
      const { $ws } = useNuxtApp()
      const socket = $ws()

      if (socket) {
        socket.close()
      }
    }
  }

  function resetPassword (token: IResetToken): void {
    resetPasswordToken.value = {
      resetPasswordToken: token.resetPasswordToken
    }
  }

  function updateUser (userValue: IUser): void {
    user.value = userValue
  }

  function logout (): void {
    const { $ws } = useNuxtApp()

    const socket = $ws?.()

    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({
            event: 'user:status:update',
            data: {
              userId: user.value.id,
              isOnline: false
            }
          }))
        } catch {
          // Ignore errors during logout
        }
      }

      (socket as WebSocket & { __manualClose?: boolean }).__manualClose = true
      socket.close()
    }

    user.value = {
      id: 0,
      username: '',
      profileImg: null,
      roles: []
    }

    userToken.value = {
      accessToken: '',
      refreshToken: '',
      tokenExpireIn: null
    }

    resetPasswordToken.value = {
      resetPasswordToken: ''
    }
  }

  return {
    user,
    userToken,
    resetToken: resetPasswordToken,
    resetPassword,
    updateUser,
    userLogin,
    logout
  }
}, {
  persist: [
    {
      pick: ['userToken', 'user', 'resetToken'],
      storage: piniaPluginPersistedstate.localStorage()
    }
  ]

}
)

export default { useAuthStore }
