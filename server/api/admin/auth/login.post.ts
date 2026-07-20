import { z } from 'zod'

const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body) //verificamos que  se ingresó correo y contraseña

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => i.message).join(', '),
    })
  }

  const { correo, password } = parsed.data

  const user = await prisma.usuario.findUnique({ //consulta base de datos
    where: { correo },
  })

  if (!user || !verifyPassword(password, user.password_hash)) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  if (!user.activo) {
    throw createError({ statusCode: 401, message: 'Cuenta inactiva' })
  }

  const token = createToken({ userId: user.id_usuario, role: user.rol }) //creamos el token

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return {
    token,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
    },
  }
})
