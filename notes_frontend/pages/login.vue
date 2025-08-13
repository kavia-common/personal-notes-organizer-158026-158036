<template>
  <div class="card stack">
    <div class="space-between">
      <h2 style="margin: 0;">{{ mode === 'login' ? 'Sign in' : 'Create account' }}</h2>
      <button class="btn" @click="toggle">{{ mode === 'login' ? 'Need an account?' : 'Have an account?' }}</button>
    </div>

    <div class="stack">
      <label class="stack">
        <span class="muted small">Username</span>
        <input class="input" v-model="username" placeholder="yourname" />
      </label>

      <label v-if="mode === 'register'" class="stack">
        <span class="muted small">Email (optional)</span>
        <input class="input" v-model="email" placeholder="you@example.com" />
      </label>

      <label class="stack">
        <span class="muted small">Password</span>
        <input class="input" type="password" v-model="password" placeholder="••••••••" @keyup.enter="submit" />
      </label>
    </div>

    <div class="row">
      <button class="btn btn-primary" @click="submit">{{ mode === 'login' ? 'Login' : 'Register' }}</button>
      <button class="btn" @click="demoFill">Demo</button>
    </div>

    <p class="muted small" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const auth = useAuth()
const route = useRoute()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function toggle() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}

function demoFill() {
  username.value = 'demo'
  password.value = 'demopassword'
}

async function submit() {
  error.value = ''
  try {
    if (mode.value === 'login') {
      await auth.login(username.value, password.value)
    } else {
      await auth.register(username.value, email.value || undefined, password.value)
    }
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e: any) {
    error.value = e?.data?.detail || e?.message || 'Authentication failed'
  }
}
</script>
