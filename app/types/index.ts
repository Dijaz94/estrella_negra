export interface EventoPublic {
  id_evento: number
  titulo: string
  descripcion: string
  artistas: string | null
  fecha_inicio: string
  fecha_fin: string | null
  fecha_hora: string
  afiche_url: string | null
  estado: 'PROGRAMADO' | 'CANCELADO' | 'FINALIZADO'
  capacidad_max: number
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

export interface SocialLink {
  id_red: number
  nombre: string
  red_url: string
}

export interface MenuItem {
  id_producto: number
  id_categoria: number
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

export interface Feedback{
  nombre:string
  email:string
  mensaje:string
}

export interface Email{
  nombre:string
  email:string
  mensaje:string
}