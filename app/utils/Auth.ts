import { useAuthStore } from '@/stores/Auth'

interface IToken {
  key: string
  value: string
}

export const getAccessToken = (): string | null => {
  const authStore = useAuthStore()
  return authStore?.userToken?.accessToken || null
}

export const getAuthToken = (): IToken | null => {
  const accessToken = getAccessToken()

  if (accessToken) {
    return {
      key: 'Authorization',
      value: `Bearer ${accessToken}`
    }
  }

  return null
}

export const getAuthForgotPasswordToken = (): IToken | null => {
  const authStore = useAuthStore()
  const resetPasswordToken = authStore?.resetToken?.resetPasswordToken || null

  if (resetPasswordToken) {
    return {
      key: 'Authorization',
      value: `Bearer ${resetPasswordToken}`
    }
  }

  return null
}
