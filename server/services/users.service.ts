import type { User } from "../types"
import { hashPassword } from "./auth.service"
export async function getAllUsers(){

    return await prisma.usuario.findMany({
        select: { id_usuario: true, nombre: true, apellido: true, correo: true, rol: true, activo: true, created_at: true }
    })

}

export async function createUser(user:User){
    if (!user || !user.nombre || !user.apellido || !user.correo || !user.rol || !user.password){
        throw createError({
            statusCode:400,
            statusMessage:"Datos incompletos"
        })
    }
    const password = hashPassword(user.password)


    try {
        const created = await prisma.usuario.create({
            data:{nombre:user.nombre,
                apellido:user.apellido,
                rol:user.rol,
                correo:user.correo,
                activo:true,
                password_hash: password
            }
        })
    return { created, ok: true }
    } catch (e: any) {
        if (e.code === 'P2002') {
            throw createError({ statusCode: 409, statusMessage: 'Ya existe un usuario con ese correo' })
        }
    throw createError({ statusCode: 500, statusMessage: 'Error al crear el usuario' })
    }
}

export async function updateUser(id:number, data: Partial<User>){
    if (!id){
        throw createError({
            statusCode:400, 
            statusMessage:'Datos incompletos'
        })
    }
    const existing = await prisma.usuario.findUnique({
        where:{id_usuario:id}
    })

    if (!existing){
        throw createError({
            statusCode:404, 
            statusMessage:'Usuario no encontrado'
        })
    }
     const prismaData: Record<string, unknown> = {}

    if (data.nombre !== undefined) prismaData.nombre = data.nombre
    if (data.apellido !== undefined) prismaData.apellido = data.apellido
    if (data.correo !== undefined) prismaData.correo = data.correo
    if (data.rol !== undefined) prismaData.rol = data.rol
    if (data.activo !== undefined) prismaData.activo = data.activo

    if (data.password){
        prismaData.password_hash = hashPassword(data.password)
    }
    if (Object.keys(prismaData).length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Sin cambios' })
      }


      try {
        const updated = await prisma.usuario.update({
        where: { id_usuario: id },
        data: prismaData,
    })
        return { updated, ok: true }
        } catch (e: any) {
            if (e.code === 'P2002') {
            throw createError({ statusCode: 409, statusMessage: 'Ya existe un usuario con ese correo' })
        }
        throw createError({ statusCode: 500, statusMessage: 'Error al actualizar el usuario' })
    }   
      
}

export async function deleteUser(id:number){

    const existing = await prisma.usuario.findUnique({
        where:{id_usuario:id}
    })

    if (!existing){
        throw createError({
            statusCode:404,
            statusMessage:'Usuario no encontrado'
        })
    }

    const deleted = await prisma.usuario.delete({
        where:{id_usuario:id}
    })
    return {deleted, ok:true}
}