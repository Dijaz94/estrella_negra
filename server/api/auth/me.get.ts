export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  let token: string | undefined

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  } else {
    token = getCookie(event, 'auth_token')
  }

  if (!token) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Token inválido o expirado' })
  }

  const user = await prisma.usuario.findUnique({
    where: { id_usuario: payload.userId },
    select: {
      id_usuario: true,
      nombre: true,
      apellido: true,
      correo: true,
      rol: true,
      activo: true,
    },
  })

  if (!user || !user.activo) {
    throw createError({ statusCode: 401, message: 'Usuario inactivo' })
  }

  return user
})
