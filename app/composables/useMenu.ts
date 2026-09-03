export function useMenu() {
  return useFetch('/api/menu', {
    key: 'menu',
  })
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