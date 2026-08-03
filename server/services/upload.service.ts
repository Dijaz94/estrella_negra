const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const BUCKET = 'estrella-negra-events'


export async function uploadImage(
  file: { data: Buffer; type?: string; filename?: string },
  folder?: string,
): Promise<string> {
  if (!file.data || file.data.length === 0) {
    throw createError({ statusCode: 400, message: 'Archivo vacío' })
  }


  const name = `${crypto.randomUUID()}.webp`
  const path = folder ? `${folder}/${name}` : name

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file.data, { contentType: 'image/webp' })

  if (error) {
    throw createError({ statusCode: 500, message: `Error al subir: ${error.message}` })
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return publicData.publicUrl
}

export async function deleteFromSupabase(url: string) {
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  const path = idx !== -1 ? url.slice(idx + marker.length) : null

  if (!path) return { ok: true }

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path])
  if (error) {
    console.warn('No se pudo eliminar imagen de Supabase:', error.message)
  }

  return { ok: true }
}

