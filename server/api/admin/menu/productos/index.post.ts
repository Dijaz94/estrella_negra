import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    id_categoria: z.number().int().positive('Categoría requerida'),
    nombre: z.string().min(1, 'El nombre es obligatorio').max(80),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    precio: z.number().int().positive('El precio debe ser mayor a 0'),
    imagen_url: z.string().max(254).nullable().optional(),
    disponible: z.boolean().optional(),
    destacado: z.boolean().optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const created = await createProduct(parsed.data)
  return { ok: true, created }
})
