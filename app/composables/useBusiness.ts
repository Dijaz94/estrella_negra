export function useBusiness() {
  return useFetch('/api/business', {
    key: 'business',
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key]
    },
  })
}