export function useAdminStats() {
  return useFetch('/api/admin/stats', { server: false })
}
