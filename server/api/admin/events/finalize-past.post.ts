export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || authHeader !== `Bearer ${config.eventsCronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const eventosFinalizados = await prisma.evento.updateMany({
    where: {
      estado: 'PROGRAMADO',
      fecha_inicio: { lt: hoy }
    },
    data: { estado: 'FINALIZADO' }
  })

  if (eventosFinalizados.count > 0) {
    await invalidateRouteCache('GET:/api/events')
  }

  return {
    updated: eventosFinalizados.count,
    message: `${eventosFinalizados.count} eventos finalizados`
  }
})
