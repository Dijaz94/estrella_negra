const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const MAX_SIZE = 5 * 1024 * 1024
const BUCKET = 'estrella-negra-events'

const EXT_MAP: Record<string, string> = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function uploadImage(
  file: { data: Buffer; type?: string; filename?: string },
  folder?: string,
): Promise<string> {
  if (!file.data || file.data.length === 0) {
    throw createError({ statusCode: 400, message: 'Archivo vacío' })
  }

  if (file.data.length > MAX_SIZE) {
    throw createError({ statusCode: 413, message: 'El archivo excede 5 MB' })
  }

  const mime = file.type ?? ''
  if (!ALLOWED_TYPES.includes(mime)) {
    throw createError({
      statusCode: 400,
      message: 'Formato no permitido. Usar: jpg, jpeg, png, webp',
    })
  }

  const ext = EXT_MAP[mime] ?? 'jpg'
  const name = `${crypto.randomUUID()}.${ext}`
  const path = folder ? `${folder}/${name}` : name

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file.data, { contentType: mime })

  if (error) {
    throw createError({ statusCode: 500, message: `Error al subir: ${error.message}` })
  }

  const { data: publicData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return publicData.publicUrl
}
