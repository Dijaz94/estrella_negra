import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const schema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    email: z.string().email('El correo es obligatorio'),
    mensaje: z.string().min(1, 'Debes ingresar un mensaje para enviar el formulario'),
    recaptchaToken: z.string().min(1, 'Token de verificación requerido'),
  })

  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Datos no válidos. Por favor, reintente el formulario',
      data: parsed.error.issues,
    })
  }

  const config = useRuntimeConfig()
  const secretKey = config.recaptchaSecretKey

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY no configurada')
    throw createError({ statusCode: 500, message: 'Error de configuración' })
  }

  try {
    const recaptchaResponse = await $fetch<{
      success: boolean
      score: number
      action: string
      'error-codes'?: string[]
    }>('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({
        secret: secretKey,
        response: parsed.data.recaptchaToken,
      }),
    })

    if (!recaptchaResponse.success || recaptchaResponse.action !== 'feedback' || recaptchaResponse.score < 0.5) {
      throw createError({
        statusCode: 400,
        message: 'Verificación de seguridad fallida. Por favor, reintente.',
      })
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('Error verificando reCAPTCHA:', e)
    throw createError({ statusCode: 500, message: 'Error al verificar el formulario' })
  }

  try {
    await sendEmail(parsed.data)
  } catch (e: any) {
    console.error('Error SMTP:', e)
    throw createError({ statusCode: 500, message: 'Error al enviar el correo' })
  }

  return { ok: true, message: 'Feedback enviado' }
})
