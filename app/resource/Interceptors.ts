import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import humps from 'humps'

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
  const res: any = humps.camelizeKeys(response.data)
  return Promise.resolve(res)
}

export function onResponseError (error: AxiosError): Promise<any> {
  if (error?.response) {
    return Promise.reject(error.response.data)
  }
  return Promise.reject(error)
}
