import type { DiaHorario } from '~/types'

const TZ_CHILE = 'America/Santiago'
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const DIA_REF = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 } as const

function diaSemanaIndex(dia: string): number {
  return DIAS.indexOf(dia)
}

export function diaDeHoy(fecha: Date = new Date()): string {
  const dia = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: TZ_CHILE }).format(fecha)
  return DIAS[DIA_REF[dia as keyof typeof DIA_REF]]!
}

export function horarioDeHoy(horario: DiaHorario[]): DiaHorario | undefined {
  const hoy = diaDeHoy()
  return horario.find((h) => h.dia === hoy)
}

export function formatoHorario(h: DiaHorario): string {
  if (!h.abierto) return 'CERRADO'
  return `${h.hora_apertura} - ${h.hora_cierre}`
}

export function ordenarDias(horario: DiaHorario[]): DiaHorario[] {
  return [...horario].sort((a, b) => diaSemanaIndex(a.dia) - diaSemanaIndex(b.dia))
}
