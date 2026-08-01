import type { DashboardStats } from "../types";

export async function  getDashboardStats():Promise<DashboardStats>{
const hoy = new Date()

  const [
    totalEventos,
    eventosProximos,
    eventosFinalizados,
    eventosCancelados,
    totalCategorias,
    totalProductos,
    productosDisponibles,
    totalUsuarios,
    usuariosActivos,
    totalRedes,
    ultimosEventos,
  ] = await Promise.all([
    prisma.evento.count(),
    prisma.evento.count({ where: { estado: 'PROGRAMADO', fecha_inicio: { gte: hoy } } }),
    prisma.evento.count({ where: { estado: 'FINALIZADO' } }),
    prisma.evento.count({ where: { estado: 'CANCELADO' } }),
    prisma.categoria.count(),
    prisma.producto.count(),
    prisma.producto.count({ where: { disponible: true } }),
    prisma.usuario.count(),
    prisma.usuario.count({ where: { activo: true } }),
    prisma.red_social.count(),
    prisma.evento.findMany({
      select: {
        id_evento: true,
        titulo: true,
        estado: true,
        fecha_inicio: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ])

  return {
    totalEventos,
    eventosProximos,
    eventosFinalizados,
    eventosCancelados,
    totalCategorias,
    totalProductos,
    productosDisponibles,
    totalUsuarios,
    usuariosActivos,
    totalRedes,
    ultimosEventos: ultimosEventos.map((e) => ({
      ...e,
      fecha_inicio: e.fecha_inicio.toISOString(),
      created_at: e.created_at.toISOString(),
    })),
  }
}