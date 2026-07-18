import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    nombre_local: z.string().min(1).max(50).optional(),
    descripcion: z.string().min(1).optional(),
    direccion: z.string().min(1).max(50).optional(),
    horario: z.array(z.object({
      dia: z.string(),
      abierto: z.boolean(),
      hora_apertura: z.string().optional(),
      hora_cierre: z.string().optional(),
    })).optional(),
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

  const data = { ...parsed.data }
  if (data.horario) {
    data.horario = JSON.stringify(data.horario) as unknown
  }

  const updated = await updateBusinessInfo(data)
  return updated
})
