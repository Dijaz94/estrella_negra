import { hashSync, compareSync } from 'bcryptjs'
import { createHash } from 'node:crypto'

const TOKEN_SECRET = process.env.NUXT_JWT_SECRET ?? 'change-me-in-production'
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface TokenPayload {
  userId: number
  role: string
  exp: number
}

export function hashPassword(password: string): string {
  return hashSync(password, 12)
}

export function verifyPassword(password: string, stored: string): boolean {
  return compareSync(password, stored)
}

export function createToken(payload: Omit<TokenPayload, 'exp'>): string {
  const exp = Date.now() + TOKEN_EXPIRY //tomamos la validez del token en milisegundos
  const data = JSON.stringify({ ...payload, exp }) //tomamos todo lo que se ingresa en el payload, y le agregamos la nueva expiración del token
  const signature = createHash('sha256') 
    .update(data + TOKEN_SECRET)
    .digest('hex')
  return Buffer.from(`${data}.${signature}`).toString('base64url')
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8')
    const dotIndex = decoded.lastIndexOf('.')
    if (dotIndex === -1) return null

    const data = decoded.slice(0, dotIndex)
    const signature = decoded.slice(dotIndex + 1)

    const expected = createHash('sha256')
      .update(data + TOKEN_SECRET)
      .digest('hex')

    if (signature !== expected) return null

    const payload: TokenPayload = JSON.parse(data)
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}
