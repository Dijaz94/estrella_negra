export default defineEventHandler(async () => {
  const business = await getBusinessInfo()
  if (!business) {
    throw createError({ statusCode: 404, message: 'No hay información del negocio' })
  }
  return business
})
