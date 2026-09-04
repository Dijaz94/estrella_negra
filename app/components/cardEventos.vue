<script setup lang="ts">
import type { EventoPublic } from '~/types'

const props = defineProps<{
  evento: EventoPublic
  showEstado?: boolean
  showActions?: boolean
}>()

const emit = defineEmits<{
  edit: [evento: EventoPublic]
  delete: [evento: EventoPublic]
}>()

const el = ref<HTMLElement | null>(null)

function onKeydownEnter() {
  if (!props.showActions) el.value?.click()
}

function estadoBadgeClass(estado: string) {
  switch (estado) {
    case 'PROGRAMADO':
      return 'bg-brand-gold/15 text-brand-gold'
    case 'CANCELADO':
      return 'bg-red-500/15 text-red-400'
    case 'FINALIZADO':
      return 'bg-text-muted/15 text-text-muted'
    default:
      return ''
  }
}

// Bloque calendario: nombre del día + número + mes (es-CL, UTC)
const calendario = computed(() => {
  const date = new Date(props.evento.fecha_inicio)
  if (isNaN(date.getTime())) return null
  const diaSemana = new Intl.DateTimeFormat('es-CL', { weekday: 'short', timeZone: 'UTC' }).format(date).toUpperCase()
  const diaNum = new Intl.DateTimeFormat('es-CL', { day: '2-digit', timeZone: 'UTC' }).format(date)
  const mes = new Intl.DateTimeFormat('es-CL', { month: 'short', timeZone: 'UTC' }).format(date).toUpperCase()
  return { diaSemana, diaNum, mes }
})

function formatPrecio(v: number) {
  return `$${v.toLocaleString('es-CL')}`
}

// Chip de precio estilo "entrada"
const precioInfo = computed(() => {
  const { precio_preventa, precio_puerta } = props.evento

  if (precio_preventa != null && precio_puerta != null) {
    return { preventa: formatPrecio(precio_preventa), puerta: formatPrecio(precio_puerta), libre: false }
  }
  if (precio_puerta != null) {
    return { puerta: formatPrecio(precio_puerta), libre: false }
  }
  if (precio_preventa != null) {
    return { puerta: formatPrecio(precio_preventa), libre: false }
  }
  return { libre: true }
})
</script>

<template>
  <article
    ref="el"
    class="card-hover group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface"
    :class="{ 'cursor-pointer': !showActions }"
    :tabindex="showActions ? undefined : 0"
    :role="showActions ? undefined : 'button'"
    @keydown.enter="onKeydownEnter"
  >
    <!-- Imagen -->
    <div class="relative aspect-video overflow-hidden">
      <img
        :src="evento.afiche_url || '/images/default_event.jpg'"
        :alt="evento.titulo"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-t from-bg-surface/75 via-bg-surface/10 to-transparent" />

      <!-- Bloque calendario -->
      <div
        v-if="calendario"
        class="absolute top-3 left-3 z-10 flex items-stretch overflow-hidden rounded-md border border-brand-gold/40 bg-bg-surface/85 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center justify-center px-3 py-2">
          <span class="font-display text-[10px] leading-none tracking-[0.2em] text-brand-gold uppercase">
            {{ calendario.diaSemana }}
          </span>
          <span class="font-display text-2xl leading-tight text-text-heading tabular-nums">
            {{ calendario.diaNum }}
          </span>
          <span class="font-display text-[10px] leading-none tracking-[0.2em] text-text-muted uppercase">
            {{ calendario.mes }}
          </span>
        </div>
      </div>

      <!-- Estado -->
      <div class="absolute top-3 right-3 z-10">
        <span
          v-if="showEstado"
          class="inline-flex items-center rounded px-2.5 py-1 font-display text-xs tracking-wider"
          :class="estadoBadgeClass(evento.estado)"
        >
          {{ evento.estado }}
        </span>
      </div>

      <!-- Chip de precio -->
      <div class="absolute bottom-3 right-3 z-10">
        <div
          v-if="!precioInfo.libre"
          class="inline-flex items-center rounded bg-bg-surface/85 px-3 py-1.5 backdrop-blur-sm"
        >
          <span v-if="precioInfo.preventa" class="flex flex-col leading-none">
            <span class="font-display text-[10px] tracking-[0.15em] text-text-muted uppercase">Preventa</span>
            <span class="font-display text-sm tracking-wider text-brand-gold tabular-nums">{{ precioInfo.preventa }}</span>
          </span>
          <span
            v-if="precioInfo.preventa && precioInfo.puerta"
            class="mx-2.5 h-6 w-px bg-border-subtle"
            aria-hidden="true"
          />
          <span v-if="precioInfo.puerta" class="flex flex-col leading-none">
            <span class="font-display text-[10px] tracking-[0.15em] text-text-muted uppercase">Puerta</span>
            <span class="font-display text-sm tracking-wider text-brand-gold tabular-nums">{{ precioInfo.puerta }}</span>
          </span>
        </div>
        <span
          v-else
          class="inline-flex items-center rounded bg-bg-surface/85 px-3 py-1.5 font-display text-sm tracking-wider text-brand-gold backdrop-blur-sm"
        >
          ENTRADA GRATUITA
        </span>
      </div>
    </div>

    <!-- Cuerpo -->
    <div class="flex flex-col gap-2 px-5 pt-4 pb-5">
      <h3 class="font-display text-xl tracking-wider text-text-heading uppercase md:text-2xl line-clamp-2">
        {{ evento.titulo }}
      </h3>

      <p class="font-body text-sm font-medium tracking-wide text-brand-gold-soft line-clamp-1">
        {{ evento.artistas || '\u00A0' }}
      </p>

      <!-- Separador ☆ -->
      <div class="my-1 flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <p class="font-body text-sm leading-relaxed text-text-muted line-clamp-2">
        {{ evento.descripcion }}
      </p>

      <!-- Meta inferior -->
      <div class="mt-auto flex items-center gap-4 pt-2 text-xs tracking-wide text-text-muted/60 uppercase">
        <span v-if="evento.fecha_hora" class="flex items-center gap-1.5">
          <span class="i-lucide-clock h-3.5 w-3.5" aria-hidden="true" />
          {{ formatHora(evento.fecha_hora) }}
        </span>
        <span class="flex items-center gap-1.5" :title="`Capacidad máxima: ${evento.capacidad_max} personas`">
          <span class="i-lucide-users h-3.5 w-3.5" aria-hidden="true" />
          {{ evento.capacidad_max }} cupos
        </span>
      </div>

      <!-- Acciones admin -->
      <div v-if="showActions" class="mt-auto flex items-center gap-2 pt-2">
        <UButton label="Editar" variant="outline" size="sm" class="flex-1" @click.stop="emit('edit', evento)" />
        <UButton label="Eliminar" color="error" variant="outline" size="sm" class="flex-1" @click.stop="emit('delete', evento)" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .card-hover:hover {
    transform: scale(1.02);
    border-color: var(--color-border-strong);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }
}
</style>
