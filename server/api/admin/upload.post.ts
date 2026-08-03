import sharp from 'sharp'

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
  // obtenemos ruta
  const folderField = body.find((f) => f.name === 'folder')
  const folder = folderField?.data
    ? Buffer.from(folderField.data).toString('utf-8').trim() || undefined
    : undefined


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
