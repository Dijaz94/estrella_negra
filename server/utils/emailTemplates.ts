// server/utils/emailTemplates.ts (o donde prefieras ubicarlo)

export function feedbackEmailHtml({
  nombre,
  email,
  mensaje,
}: {
  nombre: string
  email: string
  mensaje: string
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo feedback de cliente</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0908; font-family:'Sora', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0908; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#131211; border:1px solid #2b2928; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#1c1a19; padding:28px 32px; border-bottom:2px solid #c9a916; text-align:center;">
              <p style="margin:0; font-family:'Oswald', Arial, sans-serif; font-size:22px; letter-spacing:3px; text-transform:uppercase; color:#f7f6f3;">
                Estrella Negra
              </p>
              <p style="margin:6px 0 0; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#c9a916;">
                Nuevo feedback de cliente
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-bottom:4px;">
                    <span style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#9c9997;">Nombre</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-size:16px; color:#e9e7e1; font-weight:600;">${escapeHtml(nombre)}</span>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:4px;">
                    <span style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#9c9997;">Email</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="mailto:${escapeHtml(email)}" style="font-size:16px; color:#c9a916; text-decoration:none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
              </table>

              <!-- Separador -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border-top:1px solid #2b2928; font-size:0; line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:8px;">
                    <span style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#9c9997;">Mensaje</span>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#1c1a19; border:1px solid #2b2928; border-radius:6px; padding:16px;">
                    <p style="margin:0; font-size:15px; line-height:1.6; color:#e9e7e1; white-space:pre-wrap;">${escapeHtml(mensaje)}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1c1a19; padding:20px 32px; border-top:1px solid #2b2928; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9c9997;">
                Este mensaje fue enviado automáticamente desde el formulario de feedback de
                <span style="color:#c9a916;">Estrella Negra</span>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Evita inyección de HTML si el nombre/mensaje contiene < > & etc.
function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}