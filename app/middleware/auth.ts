export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') {
    return
  }

  try {
    const user = await $fetch('/api/auth/me')
    if (!user) {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})
