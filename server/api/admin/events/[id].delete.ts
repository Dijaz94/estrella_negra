export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  const result = await deleteEvent(id)
  await invalidateRouteCache('GET:/api/events')
  return result
})
