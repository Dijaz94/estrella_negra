import type { CategoryItem } from '~/types'

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
