
import nodemailer from 'nodemailer'
import { feedbackEmailHtml } from '../utils/emailTemplates'

export async function sendEmail(body: {nombre:string, email:string, mensaje:string}) {
  const config = useRuntimeConfig()
  

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false, // true para 465
    auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },

  })

await transporter.sendMail({
  from: `"Estrella Negra" <${config.smtpUser}>`,
  to: config.feedbackEmail,
  subject: 'Nuevo feedback de cliente',
  html: feedbackEmailHtml({
    nombre: body.nombre,
    email: body.email,
    mensaje: body.mensaje,
  }),
})



}