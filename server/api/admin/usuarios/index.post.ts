import z from 'zod'

const schema =  z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(50),
  apellido: z.string().min(1, 'El apellido es obligatorio').max(50),
  correo: z.string().email('Correo inválido').max(254),
  rol: z.enum(['ADMIN', 'EDITOR']),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export default defineEventHandler(async(event)=>{
    const body = await readBody(event)
    const parsed  = schema.safeParse(body)

    if (!parsed.success){
        throw createError({
            statusCode:400,
             message: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '),
    })
        }
        return await createUser(parsed.data)
    })