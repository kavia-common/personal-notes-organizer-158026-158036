export default defineNuxtRouteMiddleware(async (to) => {
  const { ensureAuthenticated } = useAuth()
  const ok = await ensureAuthenticated()
  if (!ok) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
