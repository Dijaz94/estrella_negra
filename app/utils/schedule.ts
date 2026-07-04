import type { DiaHorario } from '~/types'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

function diaSemanaIndex(dia: string): number {
  return DIAS.indexOf(dia)
}

export function diaDeHoy(): string {
  const d = new Date().getDay()

  return DIAS[d]!
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
