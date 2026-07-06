export default defineEventHandler(async (event) => {
  const { correo, password } = await readBody<{ correo: string; password: string }>(event)

  if (!correo || !password) {
    throw createError({ statusCode: 400, message: 'Correo y contraseña son requeridos' })
  }

  const user = await prisma.usuario.findUnique({
    where: { correo },
  })

  if (!user || !verifyPassword(password, user.password_hash)) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  if (!user.activo) {
    throw createError({ statusCode: 401, message: 'Usuario inactivo' })
  }

  const token = createToken({ userId: user.id_usuario, role: user.rol })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
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
