import { vi } from 'vitest'

// Stub Nitro globals that are injected at runtime in event handlers
vi.stubGlobal('defineEventHandler', (fn: Function) => fn)
vi.stubGlobal('createError', ({ statusCode, statusMessage, message }: any) => {
  const err = new Error(message ?? statusMessage ?? 'Error')
  ;(err as any).statusCode = statusCode
  return err
})
