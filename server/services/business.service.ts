import { parseHorario } from '../utils/horario'
import type { BusinessInfo, NegocioUpdateInput } from '../types'

export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  const negocio = await prisma.negocio.findFirst({
    include: {
      redes: true,
    },
  })

  if (!negocio) return null

  const horario = parseHorario(negocio.horario)

  return {
    ...negocio,
    horario,
    logo_url: negocio.logo_url ?? '',
    banner_url: negocio.banner_url ?? '',
    redes: negocio.redes.map((r) => ({
      id_red: r.id_red,
      nombre: r.nombre,
      red_url: r.red_url ?? '',
    })),
  }
}

const NULLABLE_FIELDS = ['logo_url', 'banner_url'] as const

export async function updateBusinessInfo(data: NegocioUpdateInput) {
  const existing = await prisma.negocio.findFirst()
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Negocio no encontrado' })
  }

  const prismaData: Record<string, unknown> = { ...data }
  for (const key of NULLABLE_FIELDS) {
    if (key in prismaData && prismaData[key] === null) {
      prismaData[key] = { set: null }
    }
  }

  try {
    const updated = await prisma.negocio.update({
      where: { id_configuracion: existing.id_configuracion },
      data: prismaData,
    })
    return updated
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Error al actualizar el negocio' })
  }
}


