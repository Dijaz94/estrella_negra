export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido' })
  }

    const currentUser = event.context.user as { id_usuario: number }

  if (currentUser.id_usuario === id){
     throw createError({ statusCode: 400, statusMessage: 'No puedes eliminar tu propia cuenta' })
  }


  return await deleteUser(id)
})