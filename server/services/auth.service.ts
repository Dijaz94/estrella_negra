import { hashSync, compareSync } from 'bcryptjs'
import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

function getTokenSecret(): string {
  const secret = useRuntimeConfig().jwtSecret
  if (!secret) {
    throw new Error('NUXT_JWT_SECRET is not configured')
  }
  return secret
}

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
  const exp = Date.now() + TOKEN_EXPIRY
  const data = JSON.stringify({ ...payload, exp })
  const signature = createHmac('sha256', getTokenSecret())
    .update(data)
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

    const expected = createHmac('sha256', getTokenSecret())
      .update(data)
      .digest('hex')

    const sigBuf = Buffer.from(signature, 'hex')
    const expBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null

    const payload: TokenPayload = JSON.parse(data)
    if (Date.now() > payload.exp) return null

    return payload
  } catch {
    return null
  }
}
