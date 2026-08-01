import type { eventoModel } from '../../app/generated/prisma/models'
import type { EventoPublic } from '~/types'
import type { EventoCreateInput, EventoUpdateInput } from '../types'

function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0))
}

function mapEventoPublic(e: eventoModel): EventoPublic {
  return {
    id_evento: e.id_evento,
    titulo: e.titulo,
    descripcion: e.descripcion,
    artistas: e.artistas,
    fecha_inicio: e.fecha_inicio.toISOString(),
    fecha_fin: e.fecha_fin ? e.fecha_fin.toISOString() : null,
    fecha_hora: e.fecha_hora.toISOString(),
    afiche_url: e.afiche_url ?? '',
    estado: e.estado,
    capacidad_max: e.capacidad_max,
  }
}

export async function getEvents(){
  const hoy = new Date
  const horaActual = hoy.toTimeString().slice(0, 5) 
  const events = await prisma.evento.findMany({
    where: {
      estado: 'PROGRAMADO',
      OR: [
        { fecha_inicio: { gt: hoy } }, // días futuros, cualquier hora
        {
          fecha_inicio: hoy, // hoy exactamente
          hora_inicio: { gte: horaActual },
        },
      ],
    },
    orderBy: { fecha_inicio: 'asc' },
  })

  return events.map(mapEventoPublic)
}

export async function getEventById(id: number){
  const event = await prisma.evento.findUnique({
    where: { id_evento: id },
  })

  return event ? mapEventoPublic(event) : null
}


export async function getAllEvents(){
  const events = await prisma.evento.findMany({
    orderBy:{fecha_inicio:'asc'}

    
  })

  return events.map(mapEventoPublic)
}

export async function createNewEvent(event: EventoCreateInput) {
  if (!event.titulo || !event.fecha_inicio || !event.fecha_hora || !event.descripcion || !event.capacidad_max) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Información incompleta',
    })
  }

  const fecha_fin = event.fecha_fin? new Date(event.fecha_fin) : null
  if(!event.afiche_url){
    event.afiche_url= '/images/default_event.jpg'
  }
  try {
    const created = await prisma.evento.create({
      data: {
        titulo: event.titulo,
        descripcion: event.descripcion,
        fecha_inicio: new Date(event.fecha_inicio),
        fecha_fin: fecha_fin,
        fecha_hora: parseTime(event.fecha_hora),
        afiche_url: event.afiche_url!,
        estado: event.estado,
        artistas: event.artistas,
        capacidad_max: event.capacidad_max,
      },
    })
    return created
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Error al guardar el evento' })
  }
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

  if (typeof prismaData.fecha_hora === 'string') {
    prismaData.fecha_hora = parseTime(prismaData.fecha_hora)
  }
  if (typeof prismaData.fecha_inicio === 'string') {
    prismaData.fecha_inicio = new Date(prismaData.fecha_inicio)
  }
  if (typeof prismaData.fecha_fin === 'string') {
    prismaData.fecha_fin = new Date(prismaData.fecha_fin)
  }

  try {
    const updated = await prisma.evento.update({
      where: { id_evento: id },
      data: prismaData,
    })
    return updated
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Error al actualizar el evento. Asegúrese de ingresar todos los datos.' })
  }
}



export async function deleteEvent(id: number) {
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID no proporcionado' })
  }

  // 1. Buscar el evento ANTES de borrar
  const data = await prisma.evento.findUnique({
    select: { afiche_url: true },
    where: { id_evento: id },
  })

  // 2. Eliminar imagen de Supabase (si existe)
  if (data?.afiche_url) {
    try {
      const BUCKET = 'estrella-negra-events'
      const marker = `/object/public/${BUCKET}/`
      const idx = data.afiche_url.indexOf(marker)
      const path = idx !== -1 ? data.afiche_url.slice(idx + marker.length) : null

      if (path) {
        const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path])
        if (error) console.warn('No se pudo eliminar imagen:', error.message)
      }
    } catch (e) {
      console.warn('Error al limpiar imagen:', e)
    }
  }

  // 3. Eliminar el registro de Prisma
  try {
    const { count } = await prisma.evento.deleteMany({
      where: { id_evento: id },
    })

    if (count === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Evento no encontrado' })
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Error al eliminar el evento' })
  }

  return { ok: true }
}

  
