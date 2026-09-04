import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    titulo: z.string().min(1, 'El título es obligatorio'),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (AAAA-MM-DD)'),
    fecha_hora: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
    capacidad_max: z.number().min(1, 'Mínimo 1 persona'),
    estado: z.enum(['PROGRAMADO', 'CANCELADO', 'FINALIZADO']),
    artistas: z.string().nullable().default(null),
    fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
    afiche_url: z.string().nullable().default(null),
    precio_preventa: z.number().int().min(1).nullable().default(null),
    precio_puerta: z.number().int().min(1).nullable().default(null),
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
