import { describe, it, expect, vi, beforeEach } from 'vitest'

// Service mocks
const createProductMock = vi.fn()
const updateProductMock = vi.fn()
const deleteProductMock = vi.fn()
const invalidateMock = vi.fn().mockResolvedValue(undefined)

// Register global auto-imports that Nitro exposes at runtime
vi.stubGlobal('createProduct', createProductMock)
vi.stubGlobal('updateProduct', updateProductMock)
vi.stubGlobal('deleteProduct', deleteProductMock)
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

describe('POST /api/admin/menu/productos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful product creation', async () => {
    const validProduct = {
      id_categoria: 1,
      nombre: 'Pisco Sour',
      descripcion: 'Clásico cóctel peruano/chileno',
      precio: 5000,
      disponible: true,
      destacado: false,
    }
    createProductMock.mockResolvedValueOnce({ id_producto: 10, ...validProduct })
    setRequestBody(validProduct)

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/index.post')
    const result = await handler(mockEvent())

    expect(createProductMock).toHaveBeenCalledWith(validProduct)
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ ok: true, created: { id_producto: 10, ...validProduct } })
  })

  it('does NOT call invalidateRouteCache when product creation fails validation', async () => {
    setRequestBody({
      nombre: '', // invalid
      precio: -100, // invalid
    })

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/index.post')
    await expect(handler(mockEvent())).rejects.toThrow()
    expect(createProductMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when createProduct throws', async () => {
    createProductMock.mockRejectedValueOnce(new Error('Insert error'))
    setRequestBody({
      id_categoria: 1,
      nombre: 'Pisco Sour',
      descripcion: 'Clásico',
      precio: 5000,
    })

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/index.post')
    await expect(handler(mockEvent())).rejects.toThrow('Insert error')
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})

describe('PUT /api/admin/menu/productos/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful product update (e.g. toggling disponible)', async () => {
    const updatePayload = {
      disponible: false,
    }
    updateProductMock.mockResolvedValueOnce({ id_producto: 10, disponible: false })
    setRequestBody(updatePayload)

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].put')
    const result = await handler(mockEvent({ context: { params: { id: '10' } } }))

    expect(updateProductMock).toHaveBeenCalledWith(
      expect.objectContaining({ disponible: false }),
      10,
    )
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ id_producto: 10, disponible: false })
  })

  it('does NOT call invalidateRouteCache when product ID is invalid', async () => {
    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: 'invalid-id' } } }))).rejects.toThrow()
    expect(updateProductMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when updateProduct throws', async () => {
    updateProductMock.mockRejectedValueOnce(new Error('Product not found'))
    setRequestBody({ disponible: true })

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].put')
    await expect(handler(mockEvent({ context: { params: { id: '999' } } }))).rejects.toThrow('Product not found')
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})

describe('DELETE /api/admin/menu/productos/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls invalidateRouteCache after successful product deletion', async () => {
    deleteProductMock.mockResolvedValueOnce({ ok: true })

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].delete')
    const result = await handler(mockEvent({ context: { params: { id: '10' } } }))

    expect(deleteProductMock).toHaveBeenCalledWith(10)
    expect(invalidateMock).toHaveBeenCalledOnce()
    expect(invalidateMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(result).toEqual({ ok: true })
  })

  it('does NOT call invalidateRouteCache when product ID is invalid', async () => {
    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].delete')
    await expect(handler(mockEvent({ context: { params: { id: '0' } } }))).rejects.toThrow()
    expect(deleteProductMock).not.toHaveBeenCalled()
    expect(invalidateMock).not.toHaveBeenCalled()
  })

  it('does NOT call invalidateRouteCache when deleteProduct throws', async () => {
    deleteProductMock.mockRejectedValueOnce(new Error('Delete error'))

    const { default: handler } = await import('../../../../../server/api/admin/menu/productos/[id].delete')
    await expect(handler(mockEvent({ context: { params: { id: '10' } } }))).rejects.toThrow('Delete error')
    expect(invalidateMock).not.toHaveBeenCalled()
  })
})
