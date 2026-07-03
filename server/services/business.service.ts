import type { BusinessInfo } from '~/types'

export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  const negocio = await prisma.negocio.findFirst({
    include: {
      redes: true,
    },
  })

  if (!negocio) return null

  return {
    ...negocio,
    redes: negocio.redes.map((r) => ({
      id_red: r.id_red,
      nombre: r.nombre,
      red_url: r.red_url,
    })),
  }
}
