import type { EventoCreateInput, EventoUpdateInput } from '../types'


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


export async function getAllEvents(){
  return await prisma.evento.findMany({
    orderBy:{fecha_inicio:'desc'}

    
  })
}

export async function createEvent(event: EventoCreateInput) {
  if (!event.titulo || !event.fecha_inicio || !event.fecha_hora || !event.descripcion || !event.capacidad_max) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Información incompleta',
    })
  }

  const created = await prisma.evento.create({
    data: {
      titulo: event.titulo,
      descripcion: event.descripcion,
      fecha_inicio: event.fecha_inicio,
      fecha_fin: event.fecha_fin,
      fecha_hora: event.fecha_hora,
      afiche_url: event.afiche_url,
      estado: event.estado,
      artistas: event.artistas,
      capacidad_max: event.capacidad_max,
    },
  })

  return created
}


const NULLABLE_FIELDS = ['artistas', 'fecha_fin', 'afiche_url'] as const

export async function updateEvent(id: number, data: EventoUpdateInput) {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const existing = await prisma.evento.findUnique({ where: { id_evento: id } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Evento no encontrado' })
  }

  const prismaData: Record<string, unknown> = { ...data }
  for (const key of NULLABLE_FIELDS) {
    if (key in prismaData && prismaData[key] === null) {
      prismaData[key] = { set: null }
    }
  }

  const updated = await prisma.evento.update({
    where: { id_evento: id },
    data: prismaData,
  })

  return updated
}

export async function deleteEvent(id: number) {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID no proporcionado' })
  }

  const { count } = await prisma.evento.deleteMany({
    where: { id_evento: id },
  })

  if (count === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Evento no encontrado' })
  }

  return { ok: true }
}