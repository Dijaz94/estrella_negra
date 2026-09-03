import { z } from 'zod'
import type { ProductoUpdateInput } from '~~/server/types'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  const schema = z.object({
    id_categoria: z.number().int().positive().optional(),
    nombre: z.string().min(1).max(80).optional(),
    descripcion: z.string().min(1).optional(),
    precio: z.number().int().positive().optional(),
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
  const parsedData:ProductoUpdateInput ={
    id_categoria: parsed.data.id_categoria,
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion,
    precio: parsed.data.precio,
    imagen_url: parsed.data.imagen_url||null,
    disponible: parsed.data.disponible,
    destacado: parsed.data.destacado
  } 
  const updated = await updateProduct(parsedData, id)
  await invalidateRouteCache('GET:/api/menu')
  return updated
})
