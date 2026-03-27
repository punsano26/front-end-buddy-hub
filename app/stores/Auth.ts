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
  userLogin(user: IUser, accessToken: string, refreshToken: string): void
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

  function userLogin (userValue: IUser, accessToken: string, refreshToken: string): void {
    user.value = userValue
    userToken.value = {
      accessToken,
      refreshToken,
      tokenExpireIn: null
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
