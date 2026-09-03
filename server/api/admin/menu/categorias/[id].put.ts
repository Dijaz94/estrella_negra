import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

  const schema = z.object({
    nombre: z.string().min(1).max(80).optional(),
    orden: z.number().int().min(1).optional(),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const updated = await updateCategory(parsed.data, id)
  await invalidateRouteCache('GET:/api/menu')
  return updated
})
