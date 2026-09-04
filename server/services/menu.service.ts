import type { Prisma } from '../../app/generated/prisma/client'
import type { CategoryItem, MenuItem } from '~/types'
import type { CategoriaCreateInput, CategoriaUpdateInput, ProductoCreateInput, ProductoUpdateInput } from '../types'
import { deleteFromSupabase } from './upload.service'

type CategoriaConProductos = Prisma.categoriaGetPayload<{ include: { productos: true } }>

function mapCategoria(cat: CategoriaConProductos): CategoryItem {
  return {
    id_categoria: cat.id_categoria,
    nombre: cat.nombre,
    orden: cat.orden,
    productos: cat.productos.map((p): MenuItem => ({
      id_producto: p.id_producto,
      id_categoria: p.id_categoria,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      imagen_url: p.imagen_url ?? '',
      disponible: p.disponible,
      destacado: p.destacado,
      categoria: cat.nombre,
    })),
  }
}

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

  return categorias.map(mapCategoria)
}


export async function getAllCategoriesAdmin(): Promise<CategoryItem[]> {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: 'asc' },
    include: { productos: true },
  })

  return categorias.map(mapCategoria)
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
      statusMessage:'Datos incompletos'
    })
  }

  const prismaData = {...event}
  const updated = await prisma.categoria.update({
      where:{
        id_categoria: id
      },
      data:
        prismaData
      
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
  return {ok:true}
}


export async function  createProduct(event: ProductoCreateInput){
if (!event || !event.nombre || !event.precio || !event.id_categoria || !event.descripcion){
  throw createError({
    statusCode: 400,
    statusMessage: 'Datos incompletos'
  })
}

  const url = event.imagen_url ? event.imagen_url:'/images/default_event.jpg'
  const created = await prisma.producto.create({
    data:{
      nombre:event.nombre,
      descripcion:event.descripcion,
      precio:event.precio,
      id_categoria:event.id_categoria,
      imagen_url: url,
      disponible: event.disponible,
      destacado: event.destacado
    }
  })

  return created
}

export async function updateProduct(product:ProductoUpdateInput, id:number){
    if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  const existing = await prisma.producto.findUnique({
    where:{id_producto:id}
  })
  if (!existing){
    throw createError({
      statusCode: 404,
      statusMessage:'Producto no encontrado'
    })
  }
  const prismaData: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(product)) {
    if (value !== undefined) {
      prismaData[key] = value
    }
  }

  if (Object.keys(prismaData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Sin cambios' })
  }

  if (product.imagen_url === null && existing.imagen_url) {
    await deleteFromSupabase(existing.imagen_url)
  }

  return await prisma.producto.update({
    where: { id_producto: id },
    data: prismaData,
  })

}

export async function deleteProduct(id:number){
  const producto = await prisma.producto.findUnique({
    where:{id_producto:id}

  })

  if (!producto){
    throw createError({
      statusCode: 404,
      statusMessage:'Producto no encontrado'
    })
  }

  if (producto.imagen_url){
    await deleteFromSupabase(producto.imagen_url)
  }

  await prisma.producto.delete({
    where:{id_producto: producto.id_producto}
  })
  return {ok:true}
}