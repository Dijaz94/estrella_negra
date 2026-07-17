export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') {
    return
  }

  if (!to.path.startsWith('/admin')) {
    return
  }

  try {
    const headers = useRequestHeaders(['cookie'])
    await $fetch('/api/auth/me', { headers })
  } catch {
    return navigateTo('/admin/login')
  }
})
