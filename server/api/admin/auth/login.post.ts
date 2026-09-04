import { z } from 'zod'

const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // max attempts per window
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): void {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return
  }

  record.count++
  if (record.count > RATE_LIMIT_MAX) {
    throw createError({
      statusCode: 429,
      message: 'Demasiados intentos. Intenta de nuevo en un minuto.',
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.issues.map(i => i.message).join(', '),
    })
  }

  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getRequestHeader(event, 'x-real-ip')
    || 'unknown'
  checkRateLimit(ip)

  const { correo, password } = parsed.data

  const user = await prisma.usuario.findUnique({
    where: { correo },
  })

  if (!user || !verifyPassword(password, user.password_hash)) {
    throw createError({ statusCode: 401, message: 'Credenciales inválidas' })
  }

  if (!user.activo) {
    throw createError({ statusCode: 401, message: 'Cuenta inactiva' })
  }

  const token = createToken({ userId: user.id_usuario, role: user.rol })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return {
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
    },
  }
})
