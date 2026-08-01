import { z } from 'zod'
 const schema = z.object({
    nombre: z.string().min(1).max(50).optional(),
    apellido: z.string().min(1).max(50).optional(),
    correo: z.string().email('Correo inválido').max(254).optional(),
    rol: z.enum(['ADMIN', 'EDITOR']).optional(),
    activo: z.boolean().optional(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  })

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

 

  const body = await readBody(event)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }

  const updated = await updateUser(id, parsed.data)
  return updated
})