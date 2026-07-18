export default defineEventHandler(async () => {
  const negocio = await getBusinessInfo()
  if (!negocio) {
    throw createError({ statusCode: 404, statusMessage: 'Negocio no encontrado' })
  }
  return negocio
})
