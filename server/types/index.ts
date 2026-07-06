import type { EstadoEvento as EstadoEventoT, Rol as EnumRol } from '../../app/generated/prisma/enums'

export type EventoEstado = EstadoEventoT
export type Rol = EnumRol

export type EventoPublic = {
  id_evento: number
  titulo: string
  descripcion: string
  artistas: string | null
  fecha_inicio: string
  fecha_fin: string | null
  fecha_hora: string
  afiche_url: string | null
  estado: EventoEstado
  capacidad_max: number
}

export interface BusinessInfo {
  id_configuracion: number
  nombre_local: string
  descripcion: string
  direccion: string
  horario: string
  telefono: string
  whatsapp: string
  correo: string
  logo_url: string
  banner_url: string
  redes: SocialLink[]
}

export interface SocialLink {
  id_red: number
  nombre: string
  red_url: string
}

export interface MenuItem {
  id_producto: number
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string
  disponible: boolean
  destacado: boolean
  categoria: string
}

export interface CategoryItem {
  id_categoria: number
  nombre: string
  orden: number
  productos: MenuItem[]
}
