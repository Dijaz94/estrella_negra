import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  const schema = z.object({
    titulo: z.string().min(1).max(100).optional(),
    descripcion: z.string().min(1).optional(),
    fecha_inicio: z.string().optional(),
    fecha_hora: z.string().optional(),
    capacidad_max: z.number().min(1).optional(),
    estado: z.enum(['PROGRAMADO', 'CANCELADO', 'FINALIZADO']).optional(),
    artistas: z.string().nullish().transform(v => v ?? null),
    fecha_fin: z.string().nullish().transform(v => v ?? null),
    afiche_url: z.string().nullish().transform(v => v ?? null),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const updated = await updateEvent(id, parsed.data)
  return updated
})
