export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  const menu = await getMenu()
  return menu
})
