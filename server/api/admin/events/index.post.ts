import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    titulo: z.string().min(1, 'El título es obligatorio'),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
    fecha_hora: z.string().min(1, 'La hora es obligatoria'),
    capacidad_max: z.number().min(1, 'Mínimo 1 persona'),
    estado: z.enum(['PROGRAMADO', 'CANCELADO', 'FINALIZADO']),
    artistas: z.string().nullish(),
    fecha_fin: z.string().nullish(),
    afiche_url: z.string().nullish(),
    precio_preventa: z.number().int().min(1).nullish(),
    precio_puerta: z.number().int().min(1).nullish(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const created = await createNewEvent(parsed.data)
  await invalidateRouteCache('GET:/api/events')
  return { ok: true, created }
})
