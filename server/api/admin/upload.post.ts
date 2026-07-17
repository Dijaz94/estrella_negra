export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body) {
    throw createError({ statusCode: 400, message: 'No se recibieron datos' })
  }

  const fileField = body.find((f) => f.name === 'file')
  if (!fileField || !fileField.data) {
    throw createError({ statusCode: 400, message: 'Campo "file" requerido' })
  }

  const folderField = body.find((f) => f.name === 'folder')
  const folder = folderField?.data
    ? Buffer.from(folderField.data).toString('utf-8').trim() || undefined
    : undefined

  const url = await uploadImage(
    {
      data: fileField.data,
      type: fileField.type,
      filename: fileField.filename,
    },
    folder,
  )

  return { url }
})
