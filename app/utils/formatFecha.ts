export function formatFecha(fecha?: string | Date | null) {
  if (!fecha) return '-'

  const date = fecha instanceof Date ? fecha : new Date(fecha)

  if (isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}