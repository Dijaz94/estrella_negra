
import nodemailer from 'nodemailer'

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
    from:`"Estrella Negra" <${config.smtpUser}>`,
    to:config.feedbackEmail,
    subject: 'Nuevo feedback de cliente',
    html: `<p><strong>Nombre:</strong> ${body.nombre}</p>
           <p><strong>Email:</strong> ${body.email}</p>
           <p><strong>Mensaje:</strong> ${body.mensaje}</p>`,
  })



}