export function formatFecha(fecha?: string | Date | null) {
  if (!fecha) return '-'

  const date = fecha instanceof Date ? fecha : new Date(fecha)

  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone:'UTC'
  }).format(date)
}

function parseFecha(fecha?: string | Date | null) {
  if (!fecha) return null

  const date = fecha instanceof Date ? fecha : new Date(fecha)

  if (isNaN(date.getTime())) return null

  return date
}

export function formatHora(fecha?: string | Date | null) {
  const date = parseFecha(fecha)

  if (!date) return '-'

  return `${new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'

  }).format(date)} hrs`
}