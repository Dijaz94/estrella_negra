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
  if (!showActions) el.value?.click()
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
    <div
      
      class="relative aspect-video overflow-hidden"
    >
      <img
        :src="evento.afiche_url || undefined"
        :alt="evento.titulo"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105 border-2 border-brand-gold-soft rounded-lg"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-t from-bg-surface/60 to-transparent" />
    </div>


    <!-- Fecha + Estado -->
    <div class="flex items-center gap-2 mx-5 mt-4" :class="{ '-mt-10': evento.afiche_url }">
      <span class="inline-flex items-center gap-1.5 rounded bg-brand-gold/15 px-3 py-1 font-display text-sm tracking-wider text-brand-gold">
        <span class="text-xs">★</span>
        {{ formatFecha(evento.fecha_inicio) }}
      </span>
      <span
        v-if="showEstado"
        class="inline-flex items-center rounded px-3 py-1 font-display text-sm tracking-wider"
        :class="estadoBadgeClass(evento.estado)"
      >
        {{ evento.estado }}
      </span>
    </div>

    <!-- Cuerpo -->
    <div class="flex flex-col gap-2 px-5 pb-5 pt-3">
      <h3 class="font-display text-xl tracking-wider text-text-heading uppercase md:text-2xl line-clamp-2 h-18">
        {{ evento.titulo }}
      </h3>

      <p
        
        class="font-body text-sm font-medium tracking-wide text-brand-gold-soft"
      >
        {{ evento.artistas || '\u00A0' }}
      </p>

      <!-- Separador ☆ -->
      <div class="my-1 flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <p class="font-body text-sm leading-relaxed text-text-muted line-clamp-2 h-6">
        {{ evento.descripcion }}
      </p>

      <!-- Meta inferior -->
      <div class="mt-auto flex items-center gap-4 pt-2 text-xs tracking-wide text-text-muted/60 uppercase">
        <span v-if="evento.fecha_hora" class="flex items-center gap-1">
          {{ formatHora(evento.fecha_hora) }}
        </span>
        <span class="flex items-center gap-1">
          ● Capacidad máxima: {{ evento.capacidad_max }} personas
        </span>
      </div>

      <!-- Acciones admin -->
      <div v-if="showActions" class="flex items-center gap-2 pt-2 mt-auto">
        <UButton label="Editar" variant="outline" size="sm" class="flex-1" @click.stop="emit('edit', evento)" />
        <UButton label="Eliminar" color="error" variant="outline" size="sm" class="flex-1" @click.stop="emit('delete', evento)" />
      </div>
    </div>
  </article>
</template>
