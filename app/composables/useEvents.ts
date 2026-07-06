export function useEvents() {
  return useFetch('/api/events')
}

export function useEvent(id: Ref<number> | number) {
  return useFetch(`/api/events/${unref(id)}`, {
    key: `event-${unref(id)}`,
  })
}
