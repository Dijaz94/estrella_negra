import sharp from 'sharp'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_FOLDER_LENGTH = 50
const FOLDER_REGEX = /^[a-zA-Z0-9_-]+$/

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body) {
    throw createError({ statusCode: 400, message: 'No se recibieron datos' })
  }
  // obtenemos archivo
  const fileField = body.find((f) => f.name === 'file')
  if (!fileField || !fileField.data) {
    throw createError({ statusCode: 400, message: 'Campo "file" requerido' })
  }

  if (fileField.data.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 400, message: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / 1024 / 1024} MB` })
  }

  // obtenemos ruta
  const folderField = body.find((f) => f.name === 'folder')
  let folder: string | undefined
  if (folderField?.data) {
    const raw = Buffer.from(folderField.data).toString('utf-8').trim()
    if (raw.length > MAX_FOLDER_LENGTH || !FOLDER_REGEX.test(raw)) {
      throw createError({ statusCode: 400, message: 'Carpeta inválida' })
    }
    folder = raw || undefined
  }


    // conversión a webp
  let webpBuffer: Buffer
  try{
    webpBuffer = await sharp(fileField.data)
    .rotate()
    .resize({width:2000, withoutEnlargement:true})
    .webp({quality:80})
    .toBuffer()
  }
  catch(e){
    throw createError({statusCode: 400, message: 'El archivo no es una imagen válida' })
  }

  const originalName = fileField.filename ?? 'imagen'
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  const newFilename = `${nameWithoutExt}.webp`

  const url = await uploadImage(
    {
      data: webpBuffer,
      type: 'image/webp',
      filename: newFilename
    },
    folder,
  )

  return { url }
})
