export function useAdminUsuarios() {
  return useFetch('/api/admin/usuarios', { server: false })
}

export async function createAdminUsuario(data: Record<string, unknown>) {
  return await $fetch('/api/admin/usuarios', {
    method: 'POST',
    body: data,
  })
}

export async function updateAdminUsuario(id: number, data: Record<string, unknown>) {
  return await $fetch(`/api/admin/usuarios/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteAdminUsuario(id: number) {
  return await $fetch(`/api/admin/usuarios/${id}`, {
    method: 'DELETE',
  })
}
