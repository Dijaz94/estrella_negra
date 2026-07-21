import type { CategoryItem } from '~/types'
import { CategoriaCreateInput, CategoriaUpdateInput } from '../types'
import { deleteFromSupabase } from './upload.service'

export async function getMenu(): Promise<CategoryItem[]> {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: 'asc' },
    include: {
      productos: {
        where: { disponible: true },
        orderBy: { id_producto: 'asc' },
      },
    },
  })

  return categorias.map((cat) => ({
    id_categoria: cat.id_categoria,
    nombre: cat.nombre,
    orden: cat.orden,
    productos: cat.productos.map((p) => ({
      id_producto: p.id_producto,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      imagen_url: p.imagen_url ?? '',
      disponible: p.disponible,
      destacado: p.destacado,
      categoria: cat.nombre,
    })),
  }))
}


export async function getAllCategoriesAdmin(){
  return await prisma.categoria.findMany({
    orderBy: {orden:'asc'},
    include: {productos:true}
  })
}

export async function  createCategory(event: CategoriaCreateInput){
  const created = await prisma.categoria.create({
    data:{
      nombre: event.nombre,
      orden: event.orden,
    }     
  })
  return created
}

export async function updateCategory(event: CategoriaUpdateInput, id:number){

  if(!event || !id){
    throw createError({
      statusCode:400,
      statusMessage:'Faltan datos para actualizar'
    })
  }


  const updated = prisma.categoria.update({
      where:{
        id_categoria: id
      },
      data:{
        data: {...event}
      }

    })
    return updated
}

export async function deleteCategory( id:number){
  const categoria = await prisma.categoria.findUnique({
    where:{id_categoria:id},
    include:{productos:true}
  })

  if (!categoria){
    throw createError({
      statusCode:404,
      statusMessage:'Categoría no encontrada'
    })
  }

  for (const p of categoria.productos){
    if (p.imagen_url){
      await deleteFromSupabase(p.imagen_url) //viene de upload.service.ts
    }
  }

  await prisma.producto.deleteMany({ where: { id_categoria: id } })
  await prisma.categoria.delete({ where: { id_categoria: id } })

}

export async function  createProduct(){

}

export async function updateProduct(){

}

export async function deleteProduct(){

}