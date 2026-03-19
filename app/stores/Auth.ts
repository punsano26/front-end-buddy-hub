import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAuthLoginData } from '~/models/response/AuthRes.model'

interface IUser extends IAuthLoginData {}

interface IToken {
  accessToken: string
  refreshToken: string
  tokenExpireIn: number | null
}

interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  userLogin(user: IUser, accessToken: string, refreshToken: string): void
  updateUser (userValue: IUser): void
  logout (): void
}

export const useAuthStore = defineStore('Auth', (): IAuthStore => {
  const user = ref<IUser>({
    id: 0,
    profileImg: null,
    roleName: ''
  })

  const userToken = ref<IToken>({
    accessToken: '',
    refreshToken: '',
    tokenExpireIn: null
  })

  function userLogin (userValue: IUser, accessToken: string, refreshToken: string): void {
    user.value = userValue
    userToken.value = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenExpireIn: null
    }
  }

  function updateUser (userValue: IUser): void {
    user.value = userValue
  }

  function logout (): void {
    user.value = {
      id: 0,
      profileImg: null,
      roleName: ''
    }
    userToken.value = {
      accessToken: '',
      refreshToken: '',
      tokenExpireIn: null
    }
  }

  return {
    user,
    userToken,
    updateUser,
    userLogin,
    logout
  }
}, {
  persist: [
    {
      pick: ['userToken', 'user'],
      storage: piniaPluginPersistedstate.localStorage()
    }
  ]
}
)

export default { useAuthStore }
