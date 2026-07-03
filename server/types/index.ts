import type { eventoModel } from '../app/generated/prisma/models'
import type { $Enums } from '../app/generated/prisma/enums'

export type EventoPublic = Pick<
  eventoModel,
  | 'id_evento'
  | 'titulo'
  | 'descripcion'
  | 'artistas'
  | 'fecha_inicio'
  | 'fecha_fin'
  | 'fecha_hora'
  | 'afiche_url'
  | 'estado'
  | 'capacidad_max'
>

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

export type EventoEstado = $Enums.EstadoEvento
export type Rol = $Enums.Rol
