export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return { ok: true }
})
