import { describe, it, expect, vi, beforeEach } from 'vitest'

const removeItemMock = vi.fn().mockResolvedValue(undefined)
vi.stubGlobal('useStorage', () => ({ removeItem: removeItemMock }))

const { invalidateRouteCache } = await import('../../../server/utils/invalidateCache')

describe('invalidateRouteCache', () => {
  beforeEach(() => {
    removeItemMock.mockClear()
  })

  it('calls removeItem with the given key', async () => {
    await invalidateRouteCache('GET:/api/menu')
    expect(removeItemMock).toHaveBeenCalledOnce()
    expect(removeItemMock).toHaveBeenCalledWith('GET:/api/menu')
  })

  it('calls removeItem for each key in parallel when multiple keys given', async () => {
    await invalidateRouteCache('GET:/api/menu', 'GET:/api/events')
    expect(removeItemMock).toHaveBeenCalledTimes(2)
    expect(removeItemMock).toHaveBeenCalledWith('GET:/api/menu')
    expect(removeItemMock).toHaveBeenCalledWith('GET:/api/events')
  })

  it('resolves cleanly when removeItem resolves undefined', async () => {
    removeItemMock.mockResolvedValueOnce(undefined)
    await expect(invalidateRouteCache('GET:/api/menu')).resolves.not.toThrow()
  })
})
