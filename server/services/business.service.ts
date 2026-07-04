import type { BusinessInfo, DiaHorario } from '~/types'

export async function getBusinessInfo(): Promise<BusinessInfo | null> {
  const negocio = await prisma.negocio.findFirst({
    include: {
      redes: true,
    },
  })

  if (!negocio) return null

  const horario: DiaHorario[] = typeof negocio.horario === 'string'
    ? JSON.parse(negocio.horario)
    : (negocio.horario as DiaHorario[])

  return {
    ...negocio,
    horario,
    redes: negocio.redes.map((r) => ({
      id_red: r.id_red,
      nombre: r.nombre,
      red_url: r.red_url,
    })),
  }
}
