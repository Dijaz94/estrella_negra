export interface RedSocialMeta {
  icon: string
  color: string
  fg: string
  label: string
}

const REDES: Record<string, RedSocialMeta> = {
  instagram: { icon: 'i-simple-icons-instagram', color: '#E4405F', fg: '#FFFFFF', label: 'Instagram' },
  tiktok: { icon: 'i-simple-icons-tiktok', color: '#FE2C55', fg: '#FFFFFF', label: 'TikTok' },
  facebook: { icon: 'i-simple-icons-facebook', color: '#1877F2', fg: '#FFFFFF', label: 'Facebook' },
  spotify: { icon: 'i-simple-icons-spotify', color: '#1DB954', fg: '#FFFFFF', label: 'Spotify' },
  youtube: { icon: 'i-simple-icons-youtube', color: '#FF0000', fg: '#FFFFFF', label: 'YouTube' },
  x: { icon: 'i-simple-icons-x', color: '#FFFFFF', fg: '#0A0908', label: 'X' },
  threads: { icon: 'i-simple-icons-threads', color: '#FFFFFF', fg: '#0A0908', label: 'Threads' },
  whatsapp: { icon: 'i-simple-icons-whatsapp', color: '#25D366', fg: '#0A0908', label: 'WhatsApp' },
  linkedin: { icon: 'i-simple-icons-linkedin', color: '#0A66C2', fg: '#FFFFFF', label: 'LinkedIn' },
  twitch: { icon: 'i-simple-icons-twitch', color: '#9146FF', fg: '#FFFFFF', label: 'Twitch' },
  pinterest: { icon: 'i-simple-icons-pinterest', color: '#BD081C', fg: '#FFFFFF', label: 'Pinterest' },
  telegram: { icon: 'i-simple-icons-telegram', color: '#26A5E4', fg: '#FFFFFF', label: 'Telegram' },
  linktree: { icon: 'i-simple-icons-linktree', color: '#43E660', fg: '#0A0908', label: 'Linktree' },
}

const FALLBACK: RedSocialMeta = {
  icon: 'i-lucide-globe',
  color: '#C9A916',
  fg: '#0A0908',
  label: 'Sitio web',
}

const ALIASES: Record<string, string> = {
  instagram: 'instagram', ig: 'instagram', insta: 'instagram',
  facebook: 'facebook', fb: 'facebook', face: 'facebook',
  tiktok: 'tiktok', tik: 'tiktok', tok: 'tiktok',
  spotify: 'spotify', spot: 'spotify',
  youtube: 'youtube', yt: 'youtube',
  x: 'x', twitter: 'x',
  threads: 'threads',
  whatsapp: 'whatsapp', wa: 'whatsapp',
  linkedin: 'linkedin',
  twitch: 'twitch',
  pinterest: 'pinterest',
  telegram: 'telegram', tg: 'telegram',
  linktree: 'linktree', linktr: 'linktree',
}

export function redSocialMeta(nombre: string): RedSocialMeta {
  const key = nombre.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  const brand = ALIASES[key]
  const meta = brand ? REDES[brand] : undefined
  if (meta) return meta
  return { ...FALLBACK, label: nombre.trim() || FALLBACK.label }
}
