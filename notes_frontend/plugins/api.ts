import type { H3Event } from 'h3'

/**
 * Nuxt plugin to provide a configured $api client using $fetch with:
 * - baseURL from runtime config
 * - Authorization header from useAuth tokens
 * - Auto refresh of access token on 401 using refresh token
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Create a dedicated $api instance
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const { getAuthHeader } = useAuth()
      const authHeader = getAuthHeader()
      options.headers = {
        ...(options.headers || {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
        'Content-Type': 'application/json',
      }
    },
    async onResponseError(ctx) {
      // Attempt token refresh once when we get 401 and have a refresh token
      if (ctx.response.status === 401) {
        const { tokens, setTokens, logout } = useAuth()
        if (tokens.value?.refresh) {
          try {
            // refresh access token
            const refreshed = await $fetch<{ access: string }>(`${config.public.apiBase}/auth/refresh/`, {
              method: 'POST',
              body: { refresh: tokens.value.refresh },
              headers: { 'Content-Type': 'application/json' },
            })
            setTokens({ access: refreshed.access, refresh: tokens.value.refresh })
            // retry original request with new token
            const retryHeaders = {
              ...(ctx.request?.options?.headers || {}),
              Authorization: `Bearer ${refreshed.access}`,
            }
            // @ts-expect-error request type
            return $fetch(ctx.request, { headers: retryHeaders })
          } catch {
            // invalid refresh -> log out
            logout()
          }
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $api: typeof $fetch
  }
}
