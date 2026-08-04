import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import humps from 'humps'
import { useAuthStore } from '~/stores/Auth'

export function onRequest (config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers = config.headers ?? {}
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    return config
  }
  return {
    ...config
    // data: config.data ? humps.decamelizeKeys(config.data) : config.data,
    // params: config.params ? humps.decamelizeKeys(config.params) : config.params
  }
}

export function onRequestError (error: AxiosError): Promise<AxiosError> {
  console.error(`[request error] [${JSON.stringify(error)}]`)
  return Promise.reject(error)
}

export function onResponse (response: AxiosResponse): Promise<any> {
  if (!response || !response.data) {
    const error: any = response
    throw error
  }
  if (response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return response.data
  }
  const res: any = humps.camelizeKeys(response.data)
  return Promise.resolve(res)
}

export async function onResponseError (error: AxiosError): Promise<any> {
  const newError = error

  // 🔄 Handle 401 Unauthorized by attempting to refresh token
  if (error.response?.status === 401) {
    const config = error.config
    // Avoid infinite loop if refreshing fails
    if (config && config.url && config.url.includes('/auth/sessions/refresh')) {
      return Promise.reject(error)
    }

    const authStore = useAuthStore()
    if (authStore.userToken.refreshToken) {
      try {
        const { forceRefreshToken } = await import('~/utils/authRefresh')
        const isSuccess = await forceRefreshToken()
        if (isSuccess) {
          if (!config) {
            return Promise.reject(error)
          }

          if (config.headers) {
            config.headers.Authorization = `Bearer ${authStore.userToken.accessToken}`
          }
          const response = await axios(config)
          return onResponse(response)
        } else {
          const { useBanStore } = await import('~/stores/Ban')
          const banStore = useBanStore()
          void banStore.triggerForceLogout('เซสชันหมดอายุ หรือบัญชีถูกระงับการใช้งาน')
          return Promise.reject(error)
        }
      } catch (err: any) {
        console.error('[Interceptors] Force refresh token failed:', err)
        const { useBanStore } = await import('~/stores/Ban')
        const banStore = useBanStore()
        void banStore.triggerForceLogout('เซสชันหมดอายุ หรือบัญชีถูกระงับการใช้งาน')
        return Promise.reject(error)
      }
    } else {
      const { useBanStore } = await import('~/stores/Ban')
      const banStore = useBanStore()
      void banStore.triggerForceLogout('เซสชันหมดอายุ หรือไม่มีข้อมูลการเข้าสู่ระบบ')
      return Promise.reject(error)
    }
  }

  if (error.response?.status === 403) {
    const data = error.response.data as any
    const message = typeof data === 'string'
      ? data
      : (data?.message || data?.error || 'บัญชีของคุณถูกระงับการใช้งาน หรือไม่มีสิทธิ์เข้าถึง')

    const { useBanStore } = await import('~/stores/Ban')
    const banStore = useBanStore()
    void banStore.triggerForceLogout(message)
    return Promise.reject(error)
  }

  if (
    error.request
    && error.request.responseType === 'blob'
    && error?.response?.data instanceof Blob
    && error?.response?.data?.type
    && error?.response?.data?.type.toLowerCase().indexOf('json') !== -1
  ) {
    await new Promise((resolve: any, reject: any): void => {
      const reader = new FileReader() as any
      reader.onload = (): any => {
        // @ts-ignore: set new error data
        newError.response.data = JSON.parse(reader.result)
        resolve(Promise.reject(newError?.response?.data))
      }

      reader.onerror = (): any => {
        reject(error)
      }

      reader.readAsText(error?.response?.data)
    })

    return Promise.reject(newError?.response?.data)
  }
  if (newError?.response?.data) {
    return Promise.reject(newError.response.data)
  }

  return Promise.reject(newError)
}
