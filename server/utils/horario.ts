import { z } from 'zod'
import type { DiaHorario } from '../types'

export const diaHorarioSchema = z.object({
  dia: z.string(),
  abierto: z.boolean(),
  hora_apertura: z.string().optional(),
  hora_cierre: z.string().optional(),
})

export const horarioSchema = z.array(diaHorarioSchema)

export function parseHorario(value: unknown): DiaHorario[] {
  try {
    const raw = typeof value === 'string' ? JSON.parse(value) : value
    return horarioSchema.parse(raw ?? [])
  } catch {
    return []
  }
}
