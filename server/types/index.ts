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

export type EventoCreateInput = Omit<EventoPublic, 'id_evento'>

export type EventoUpdateInput = {
  titulo?: string
  descripcion?: string
  artistas?: string | null
  fecha_inicio?: Date | string
  fecha_fin?: Date | string | null
  fecha_hora?: Date | string
  afiche_url?: string | null
  estado?: 'PROGRAMADO' | 'CANCELADO' | 'FINALIZADO'
  capacidad_max?: number
}
export interface DiaHorario {
  dia: string
  abierto: boolean
  hora_apertura?: string
  hora_cierre?: string
}

export interface BusinessInfo {
  id_configuracion: number
  nombre_local: string
  descripcion: string
  direccion: string
  horario: DiaHorario[]
  telefono: string
  whatsapp: string
  correo: string
  logo_url: string
  banner_url: string
  redes: SocialLink[]
}

export interface SocialLinkInput {
  nombre: string
  red_url: string
}

export interface SocialLink {
  id_red: number
  nombre: string
  red_url: string
}

export type NegocioUpdateInput = {
  nombre_local?: string
  descripcion?: string
  direccion?: string
  horario?: DiaHorario[]
  telefono?: string
  whatsapp?: string
  correo?: string
  logo_url?: string | null
  banner_url?: string | null
  redes?: SocialLinkInput[]
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

export interface CategoriaCreateInput {
  nombre: string
  orden: number
}

export interface CategoriaUpdateInput {
  nombre?: string
  orden?: number
}

export interface ProductoCreateInput {
  id_categoria: number
  nombre: string
  descripcion: string
  precio: number
  imagen_url?: string | null
  disponible?: boolean
  destacado?: boolean
}

export interface ProductoUpdateInput {
  id_categoria?: number
  nombre?: string
  descripcion?: string
  precio?: number
  imagen_url: string | null
  disponible?: boolean
  destacado?: boolean
}