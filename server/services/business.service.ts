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

  const { redes, ...scalarData } = data
  const prismaData: Record<string, unknown> = { ...scalarData }
  for (const key of NULLABLE_FIELDS) {
    if (key in prismaData && prismaData[key] === null) {
      prismaData[key] = { set: null }
    }
  }

  try {
    const hasScalarChanges = Object.keys(prismaData).length > 0
    const hasRedesChanges = redes !== undefined

    if (!hasScalarChanges && !hasRedesChanges) return existing

    await prisma.$transaction(async (tx) => {
      if (hasScalarChanges) {
        await tx.negocio.update({
          where: { id_configuracion: existing.id_configuracion },
          data: prismaData,
        })
      }

      if (hasRedesChanges) {
        await tx.red_social.deleteMany({
          where: { id_configuracion: existing.id_configuracion },
        })
        if (redes!.length > 0) {
          await tx.red_social.createMany({
            data: redes!.map((r) => ({
              nombre: r.nombre,
              red_url: r.red_url || null,
              id_configuracion: existing.id_configuracion,
            })),
          })
        }
      }
    })

    return getBusinessInfo()
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 500, message: 'Error al actualizar el negocio' })
  }
}


