/**
 * Removes one or more Nitro SWR cache entries so the next request
 * re-fetches from the database. Keys follow the pattern `<METHOD>:<path>`.
 */
export async function invalidateRouteCache(...keys: string[]) {
  const storage = useStorage('nitro:handlers')
  await Promise.all(keys.map(k => storage.removeItem(k)))
}
