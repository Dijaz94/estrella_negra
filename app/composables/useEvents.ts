export function useEvents() {
  return useFetch('/api/events')
}

export function useEvent(id: Ref<number> | number) {
  return useFetch(`/api/events/${unref(id)}`, {
    key: `event-${unref(id)}`,
  })
}

export function useAdminEvents(){
    return useFetch('/api/admin/events', { server: false })
}

export async function createAdminEvent(data:Record<string, unknown>){
  return await $fetch('/api/admin/events',{
    method:'POST',
    body:data
  })
}

export async function deleteAdminEvent(id: number) {
  return await $fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
}