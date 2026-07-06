export default defineEventHandler(async () => {
  const menu = await getMenu()
  return menu
})
