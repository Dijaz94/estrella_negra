import type { User } from "../types"
import { hashPassword } from "./auth.service"
export async function getAllUsers(){

    return await prisma.usuario.findMany()

}

export async function createUser(user:User){
    if (!user || !user.nombre || !user.apellido || !user.correo || !user.rol || !user.password){
        throw createError({
            statusCode:401,
            statusMessage:"Datos incompletos"
        })
    }
    const password = hashPassword(user.password)

    const created = await prisma.usuario.create({
        data:{nombre:user.nombre,
            apellido:user.apellido,
            rol:user.rol,
            correo:user.correo,
            activo:true,
            password_hash: password
        }
    })
    return {created, ok:true}
}

export async function updateUser(){

}

export async function deleteUser(){

}