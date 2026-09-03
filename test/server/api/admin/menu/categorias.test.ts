import { describe, it, expect, vi, beforeEach } from 'vitest'

// Service mocks
const createCategoryMock = vi.fn()
const updateCategoryMock = vi.fn()
const deleteCategoryMock = vi.fn()
const invalidateMock = vi.fn().mockResolvedValue(undefined)

// Register global auto-imports that Nitro exposes at runtime
vi.stubGlobal('createCategory', createCategoryMock)
vi.stubGlobal('updateCategory', updateCategoryMock)
vi.stubGlobal('deleteCategory', deleteCategoryMock)
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

describe('POST /api/admin/menu/categorias', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful category creation', async () => {
    createCategoryMock.mockResolvedValueOnce({ id_categoria: 1, nombre: 'Cocteles', orden: 1 })
    setRequestBody({ nombre: 'Cocteles', orden: 1 })

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/index.post')
    const result = await handler(mockEvent())

    expect(createCategoryMock).toHaveBeenCalledWith({ nombre: 'Cocteles', orden: 1 })
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ ok: true, created: { id_categoria: 1, nombre: 'Cocteles', orden: 1 } })
  })

  it('does NOT call invalidateRouteCache when createCategory throws', async () => {
    createCategoryMock.mockRejectedValueOnce(new Error('Database connection failed'))
    setRequestBody({ nombre: 'Cocteles', orden: 1 })

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/index.post')
    await expect(handler(mockEvent())).rejects.toThrow('Database connection failed')
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when validation fails', async () => {
    setRequestBody({ nombre: '', orden: 0 }) // invalid: name empty, orden < 1

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/index.post')
    await expect(handler(mockEvent())).rejects.toThrow()
    expect(createCategoryMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})

describe('PUT /api/admin/menu/categorias/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful category update', async () => {
    updateCategoryMock.mockResolvedValueOnce({ id_categoria: 1, nombre: 'Vinos', orden: 2 })
    setRequestBody({ nombre: 'Vinos', orden: 2 })

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].put')
    const result = await handler(mockEvent({ context: { params: { id: '1' } } }))

    expect(updateCategoryMock).toHaveBeenCalledWith({ nombre: 'Vinos', orden: 2 }, 1)
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ id_categoria: 1, nombre: 'Vinos', orden: 2 })
  })

  it('does NOT call invalidateRouteCache when ID is invalid', async () => {
    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: 'abc' } } }))).rejects.toThrow()
    expect(updateCategoryMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when updateCategory throws', async () => {
    updateCategoryMock.mockRejectedValueOnce(new Error('Update failed'))
    setRequestBody({ nombre: 'Vinos' })

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: '1' } } }))).rejects.toThrow('Update failed')
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/admin/menu/categorias/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful category deletion', async () => {
    deleteCategoryMock.mockResolvedValueOnce({ ok: true })

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].delete')
    const result = await handler(mockEvent({ context: { params: { id: '5' } } }))

    expect(deleteCategoryMock).toHaveBeenCalledWith(5)
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ ok: true })
  })

  it('does NOT call invalidateRouteCache when ID is invalid', async () => {
    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].delete')
    await expect(handler(mockEvent({ context: { params: { id: 'invalid' } } }))).rejects.toThrow()
    expect(deleteCategoryMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when deleteCategory throws', async () => {
    deleteCategoryMock.mockRejectedValueOnce(new Error('Not found'))

    const { default: handler } = await import('../../../../../server/api/admin/menu/categorias/[id].delete')
    await expect(handler(mockEvent({ context: { params: { id: '99' } } }))).rejects.toThrow('Not found')
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})
