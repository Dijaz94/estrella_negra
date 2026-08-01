import  z from 'zod'
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

  const currentUser = event.context.user as { id_usuario: number }

    if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
  }


  if (currentUser.id_usuario === id && parsed.data?.activo === false){
    throw createError({ statusCode: 400, statusMessage: 'No puedes desactivar tu propia cuenta' })
  }
  if (currentUser.id_usuario === id && parsed.data?.rol === 'EDITOR'){
    throw createError({ statusCode: 400, statusMessage: 'No puedes cambiar tu propio rol' })
  }


  const updated = await updateUser(id, parsed.data)
  return updated
})