import { z } from 'zod'
import type { NegocioUpdateInput } from '~~/server/types'
import { horarioSchema } from '~~/server/utils/horario'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    nombre_local: z.string().min(1).max(50).optional(),
    descripcion: z.string().min(1).optional(),
    direccion: z.string().min(1).max(50).optional(),
    horario: horarioSchema.optional(),
    telefono: z.string().max(20).optional(),
    whatsapp: z.string().max(20).optional(),
    correo: z.string().email().max(254).optional(),
    logo_url: z.string().max(254).nullable().optional(),
    banner_url: z.string().max(254).nullable().optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const data: NegocioUpdateInput = { ...parsed.data }

  const updated = await updateBusinessInfo(data)
  return updated
})
