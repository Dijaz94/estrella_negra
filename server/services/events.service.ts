import type { EventoPublic } from '~/types'


export async function getEvents(){
  const events = await prisma.evento.findMany({
    where: { estado: 'PROGRAMADO' },
    orderBy: { fecha_inicio: 'asc' },
  })

  return events
}

export async function getEventById(id: number){
  const event = await prisma.evento.findUnique({
    where: { id_evento: id },
  })

  return event
}
