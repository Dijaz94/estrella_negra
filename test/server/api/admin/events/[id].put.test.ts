import { describe, it, expect, vi, beforeEach } from 'vitest'

const updateEventMock = vi.fn()
const invalidateMock = vi.fn().mockResolvedValue(undefined)

vi.stubGlobal('updateEvent', updateEventMock)
vi.stubGlobal('invalidateRouteCache', invalidateMock)

function mockEvent(overrides = {}) {
  return {
    context: { params: {}, ...overrides },
    ...overrides,
  } as any
}

function setRequestBody(body: any) {
  vi.stubGlobal('readBody', vi.fn().mockResolvedValue(body))
}

describe('PUT /api/admin/events/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateEvent and invalidates cache on successful update', async () => {
    const payload = { titulo: 'Noche de Jazz', capacidad_max: 60 }
    updateEventMock.mockResolvedValueOnce({ id_evento: 1, ...payload })
    setRequestBody(payload)

    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    const result = await handler(mockEvent({ context: { params: { id: '1' } } }))

    expect(updateEventMock).toHaveBeenCalledWith(1, expect.objectContaining({ titulo: 'Noche de Jazz', capacidad_max: 60 }))
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/events')
    expect(result).toEqual({ id_evento: 1, titulo: 'Noche de Jazz', capacidad_max: 60 })
  })

  it('does NOT pass nullable fields when body omits them (partial update safety)', async () => {
    updateEventMock.mockResolvedValueOnce({ id_evento: 1 })
    setRequestBody({ titulo: 'Solo título' })

    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    await handler(mockEvent({ context: { params: { id: '1' } } }))

    const passedData = updateEventMock.mock.calls[0][1]
    expect(passedData).not.toHaveProperty('artistas')
    expect(passedData).not.toHaveProperty('afiche_url')
    expect(passedData).not.toHaveProperty('fecha_fin')
    expect(passedData).not.toHaveProperty('precio_preventa')
    expect(passedData).not.toHaveProperty('precio_puerta')
  })

  it('passes explicit null when body sends null (intentional clear)', async () => {
    updateEventMock.mockResolvedValueOnce({ id_evento: 1 })
    setRequestBody({ titulo: 'Edit', artistas: null, afiche_url: null })

    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    await handler(mockEvent({ context: { params: { id: '1' } } }))

    const passedData = updateEventMock.mock.calls[0][1]
    expect(passedData.artistas).toBeNull()
    expect(passedData.afiche_url).toBeNull()
  })

  it('passes prices when explicitly sent', async () => {
    updateEventMock.mockResolvedValueOnce({ id_evento: 1 })
    setRequestBody({ titulo: 'Edit', precio_preventa: 5000, precio_puerta: 8000 })

    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    await handler(mockEvent({ context: { params: { id: '1' } } }))

    const passedData = updateEventMock.mock.calls[0][1]
    expect(passedData.precio_preventa).toBe(5000)
    expect(passedData.precio_puerta).toBe(8000)
  })

  it('rejects invalid event ID', async () => {
    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: '0' } } }))).rejects.toThrow('ID inválido')
    expect(updateEventMock).not.toHaveBeenCalled()
  })

  it('rejects body with invalid fields', async () => {
    setRequestBody({ titulo: '' })
    const { default: handler } = await import('../../../../../server/api/admin/events/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: '1' } } }))).rejects.toThrow()
    expect(updateEventMock).not.toHaveBeenCalled()
  })
})
