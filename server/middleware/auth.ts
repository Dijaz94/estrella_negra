export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/admin')) {
    return
  }

  if (path === '/api/admin/auth/login' || path === '/api/admin/auth/logout') {
    return
  }

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
