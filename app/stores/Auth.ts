import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

interface IUser {
  userId: number
  email: string
  username: string
  profileImg: string | null
  roleName: string
}

interface IToken {
  token: string
  refreshToken: string
  expireIn: number | null
}

interface IAuthStore {
  user: Ref<IUser>
  userToken: Ref<IToken>
  userLogin(user: IUser, token: string, refreshToken: string): void
  updateUser (userValue: IUser): void
  logout (): void
}

export const useAuthStore = defineStore('Auth', (): IAuthStore => {
  const user = ref<IUser>({
    userId: 0,
    email: '',
    username: '',
    profileImg: null,
    roleName: ''
  })

  const userToken = ref<IToken>({
    token: '',
    refreshToken: '',
    expireIn: null
  })

  function userLogin (userValue: IUser, token: string, refreshToken: string): void {
    user.value = userValue
    userToken.value = {
      token,
      refreshToken,
      expireIn: null
    }
  }

  function updateUser (userValue: IUser): void {
    user.value = userValue
  }

  function logout (): void {
    user.value = {
      userId: 0,
      email: '',
      username: '',
      profileImg: null,
      roleName: ''
    }
    userToken.value = {
      token: '',
      refreshToken: '',
      expireIn: null
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
