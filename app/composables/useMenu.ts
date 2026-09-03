export function useMenu() {
  return useFetch('/api/menu', {
    key: 'menu',
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key]
    },
  })
}

const MENU_POLL_INTERVAL = 20_000

export function startMenuPolling(refresh: () => Promise<void>) {
  const id = setInterval(() => { refresh() }, MENU_POLL_INTERVAL)
  return () => clearInterval(id)
}

export function useAdminMenu(){
  const data = useFetch('/api/admin/menu/categorias', {server:false})
  return data
}

// CRUD Categorías
export async function createAdminCategory(data: Record<string, unknown>) {
  return await $fetch('/api/admin/menu/categorias', {
    method: 'POST',
    body: data,
  })
}

export async function updateAdminCategory(id: number, data: Record<string, unknown>) {
  return await $fetch(`/api/admin/menu/categorias/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteAdminCategory(id: number) {
  return await $fetch(`/api/admin/menu/categorias/${id}`, {
    method: 'DELETE',
  })
}

// CRUD Productos
export async function createAdminProduct(data: Record<string, unknown>) {
  return await $fetch('/api/admin/menu/productos', {
    method: 'POST',
    body: data,
  })
}

export async function updateAdminProduct(id: number, data: Record<string, unknown>) {
  return await $fetch(`/api/admin/menu/productos/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteAdminProduct(id: number) {
  return await $fetch(`/api/admin/menu/productos/${id}`, {
    method: 'DELETE',
  })
}