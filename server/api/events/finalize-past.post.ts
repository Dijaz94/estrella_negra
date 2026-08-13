export default defineEventHandler(async (event)=>{
const authHeader = getHeader(event, 'authorization')
const secret = process.env.EVENTS_CRON_SECRET

if (!authHeader || authHeader !== `Bearer ${secret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

const hoy = new Date()
hoy.setHours(0,0,0,0)

const eventosFinalizados = await prisma.evento.updateMany({
    where: {
      estado: 'PROGRAMADO',
      fecha_inicio: { lt: hoy }
    },
    data: { estado: 'FINALIZADO' }
  })

  return { 
    updated: eventosFinalizados.count,
    message: `${eventosFinalizados.count} eventos finalizados`
  }

})