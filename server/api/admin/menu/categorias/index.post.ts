import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const schema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(30),
    orden: z.number().int().min(1),
  })

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const created = await createCategory(parsed.data)
  await invalidateRouteCache('GET:/api/menu')
  return { ok: true, created }
})
