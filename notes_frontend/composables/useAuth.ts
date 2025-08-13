export type User = {
  id: number
  username: string
  email?: string
}

export type Tokens = {
  access: string
  refresh: string
}

type AuthState = {
  user: User | null
  tokens: Tokens | null
}

const tokensKey = 'notes.tokens.v1'

/**
 * Composable responsible for managing auth state and providing
 * helper methods for login/register/logout and user fetching.
 */
// PUBLIC_INTERFACE
export function useAuth() {
  /** Reactive tokens state (SSR-safe) */
  const tokens = useState<Tokens | null>('auth_tokens', () => {
    if (process.client) {
      try {
        const raw = localStorage.getItem(tokensKey)
        return raw ? (JSON.parse(raw) as Tokens) : null
      } catch {
        return null
      }
    }
    return null
  })

  /** Reactive user state */
// PUBLIC_INTERFACE
  const user = useState<User | null>('auth_user', () => null)

  // Persist tokens client-side
  watch(tokens, (val) => {
    if (process.client) {
      if (val) localStorage.setItem(tokensKey, JSON.stringify(val))
      else localStorage.removeItem(tokensKey)
    }
  }, { deep: true })

  // PUBLIC_INTERFACE
  function isAuthenticated() {
    return !!tokens.value?.access
  }

  // PUBLIC_INTERFACE
  function getAuthHeader() {
    return tokens.value?.access ? `Bearer ${tokens.value.access}` : ''
  }

  // PUBLIC_INTERFACE
  function setTokens(next: Tokens | null) {
    tokens.value = next
  }

  // PUBLIC_INTERFACE
  async function fetchMe() {
    const { $api } = useNuxtApp()
    if (!isAuthenticated()) {
      user.value = null
      return null
    }
    try {
      const me = await $api<User>('/auth/me/')
      user.value = me
      return me
    } catch {
      user.value = null
      return null
    }
  }

  // PUBLIC_INTERFACE
  async function login(username: string, password: string) {
    const { $api } = useNuxtApp()
    const res = await $api<{ access: string; refresh: string }>('/auth/token/', {
      method: 'POST',
      body: { username, password },
    })
    setTokens({ access: res.access, refresh: res.refresh })
    await fetchMe()
    return user.value
  }

  // PUBLIC_INTERFACE
  async function register(username: string, email: string | undefined, password: string) {
    const { $api } = useNuxtApp()
    await $api<User>('/auth/register/', {
      method: 'POST',
      body: { username, email, password },
    })
    // After register, login
    await login(username, password)
    return user.value
  }

  // PUBLIC_INTERFACE
  function logout() {
    setTokens(null)
    user.value = null
    // Navigation is optional; caller may redirect
  }

  // PUBLIC_INTERFACE
  async function ensureAuthenticated() {
    if (!isAuthenticated()) return false
    if (!user.value) await fetchMe()
    return !!user.value
  }

  return {
    user,
    tokens,
    isAuthenticated,
    getAuthHeader,
    setTokens,
    fetchMe,
    login,
    register,
    logout,
    ensureAuthenticated,
  }
}
