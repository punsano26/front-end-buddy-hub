import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import humps from 'humps'

let cachedClientIp: string | null = '127.0.0.1'

const enableXForwardedFor: boolean = import.meta.env.VITE_ENV_ENABLE_X_FORWARDED_FOR === 'true'

if (enableXForwardedFor && typeof window !== 'undefined') {
  fetch('https://api.ipify.org?format=json')
    .then((response: Response): Promise<any> => response.json())
    .then((data: any): void => {
      cachedClientIp = (data?.ip as string) ?? '127.0.0.1'
    })
    .catch((): void => {
      cachedClientIp = '127.0.0.1'
    })
}

export function onRequest (config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers = config.headers ?? {}

  if (enableXForwardedFor && cachedClientIp && !config.headers['X-Forwarded-For']) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('X-Forwarded-For', cachedClientIp)
    } else {
      config.headers['X-Forwarded-For'] = cachedClientIp
    }
  }

  if (config.headers['Content-Type'] === 'multipart/form-data') {
    return config
  }
  return {
    ...config
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
  if (
    error.request.responseType === 'blob'
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
