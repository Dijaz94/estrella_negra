export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID inválido' })
  }

  const ev = await getEventById(id)
  if (!ev) {
    throw createError({ statusCode: 404, message: 'Evento no encontrado' })
  }

  return ev
})
