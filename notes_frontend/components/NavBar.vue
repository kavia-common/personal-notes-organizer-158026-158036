<template>
  <div class="space-between" style="width: 100%;">
    <div class="brand">
      <span class="brand-badge">N</span>
      <span>{{ appName }}</span>
    </div>
    <div class="nav-actions">
      <template v-if="auth.user">
        <span class="muted small">Signed in as <strong>{{ auth.user.username }}</strong></span>
        <button class="btn" @click="toNotes">Notes</button>
        <button class="btn" @click="logout">Logout</button>
      </template>
      <template v-else>
        <button class="btn" @click="toLogin">Login</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName || 'Notes')
const router = useRouter()
const auth = useAuth()

function toLogin() {
  router.push('/login')
}
function toNotes() {
  router.push('/')
}
function logout() {
  auth.logout()
  router.push('/login')
}
</script>
