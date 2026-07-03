export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/admin')) {
    return
  }

  if (path === '/api/admin/auth/login') {
    return
  }

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'No autorizado' })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Token inválido' })
  }

  const user = await prisma.usuario.findUnique({
    where: { id_usuario: payload.userId },
    select: { id_usuario: true, correo: true, rol: true, activo: true },
  })

  if (!user || !user.activo) {
    throw createError({ statusCode: 401, message: 'Usuario inactivo' })
  }

  event.context.user = user
})
