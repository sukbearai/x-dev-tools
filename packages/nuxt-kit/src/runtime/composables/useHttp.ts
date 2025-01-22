import type { FetchError, FetchResponse, SearchParameters } from 'ofetch'
import { hash } from 'ohash'
import { useLogger } from '@suwujs/logger'
import type { AsyncData, UseFetchOptions } from '#app'
import type { KeysOf } from '#app/composables/asyncData'
import { type Ref, isRef, useFetch, useRuntimeConfig } from '#imports'

type UrlType = string | Request | Ref<string | Request> | (() => string | Request)

type HttpOption<T> = UseFetchOptions<ResOptions<T>, T, KeysOf<T>, any>
interface ResOptions<T> {
  data: T
  code: number
  message: boolean
  err?: string[]
}

function handleError<T>(
  _method: string | undefined,
  _response: FetchResponse<ResOptions<T>> & FetchResponse<any>,
) {
  // Implement error handling logic here
  if (_response?._data?.statusCode === 401) {
    // setUser('')
  }
  console.error(`[useHttp] [error] ${_method}:`, _response)
}

function checkRef(obj: Record<string, any>) {
  return Object.keys(obj).some(key => isRef(obj[key]))
}

function fetch<T>(url: UrlType, opts: HttpOption<T>): AsyncData<ResOptions<T>, FetchError<ResOptions<T>>> {
  // Check the `key` option
  const { key, params, watch } = opts
  if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
    console.error('\x1B[31m%s\x1B[0m %s', '[useHttp] [error]', 'The `key` option is required when `params` or `watch` has ref properties, please set a unique key for the current request.')

  const options = opts as UseFetchOptions<ResOptions<T>>
  options.lazy = options.lazy ?? true

  const config = useRuntimeConfig()

  return useFetch<ResOptions<T>>(url, {
    // Request interception
    onRequest({ options }) {
      // Set the base URL
      options.baseURL = config.public.http.baseURL
      useLogger('use-http').log(`fetch baseURL: ${options.baseURL}`)
    },
    // Response interception
    onResponse(_context) {
      // Handle the response
    },
    // Error interception
    onResponseError({ response, options: { method } }) {
      handleError<T>(method, response)
    },
    // Set the cache key
    key: key ?? hash(['api-fetch', url, JSON.stringify({ method: options.method, params: options.params })]),
    // Merge the options
    ...options,
  }) as AsyncData<ResOptions<T>, FetchError<ResOptions<T>>>
}

export const $http = {
  get: <T>(url: UrlType, params?: SearchParameters, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'get', params, ...option })
  },

  post: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'post', body, ...option })
  },
}

export function useHttp() {
  return {
    $http,
  }
}
