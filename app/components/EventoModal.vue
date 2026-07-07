<script setup lang="ts">
import type { EventoPublic } from '~/types'

const props = defineProps<{
  evento: EventoPublic | null
}>()

const emit = defineEmits<{
  close: []
}>()

const open = computed({
  get: () => props.evento !== null,
  set: (val: boolean) => { if (!val) emit('close') },
})

const { data: business } = useBusiness()

const whatsappLink = computed(() => {
  if (!business.value?.whatsapp || !props.evento) return null
  const msg = `Hola, quiero reservar entradas para ${props.evento.titulo} el día ${formatFecha(props.evento.fecha_inicio)}`
  return `https://wa.me/${business.value.whatsapp}?text=${encodeURIComponent(msg)}`
})

const badgeText = computed(() => {
  if (!props.evento) return ''
  const inicio = formatFecha(props.evento.fecha_inicio)
  if (props.evento.fecha_fin) {
    return `${inicio} → ${formatFecha(props.evento.fecha_fin)}`
  }
  return inicio
})

const estadoBadge = computed(() => {
  if (!props.evento) return null
  switch (props.evento.estado) {
    case 'CANCELADO':
      return { text: 'CANCELADO', class: 'bg-red-500/15 text-red-400' }
    case 'FINALIZADO':
      return { text: 'FINALIZADO', class: 'bg-text-muted/15 text-text-muted' }
    default:
      return null
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="evento?.titulo ?? ''"
    :description="evento?.descripcion ?? ''"
    :ui="{ content: 'max-w-2xl w-full' }"
  >
    <template #content="{ close }">
      <div class="flex flex-col overflow-hidden">
        <UButton @click="close" 
          class="absolute font-bold top-3 right-3 z-10 flex items-center justify-center rounded-xl border  text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold/10"
          icon="i-lucide-x"  variant="outline"
        />
        <div
          v-if="evento?.afiche_url"
          class="relative aspect-video overflow-hidden"
        >
          <img
            :src="evento.afiche_url"
            :alt="evento.titulo"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-linear-to-t from-bg-surface to-transparent" />

        </div>

        <div
          class="flex items-center justify-between gap-2 px-5"
          :class="evento?.afiche_url ? '-mt-6' : 'mt-5'"
        >
          <span
            v-if="evento"
            class="inline-flex items-center gap-1.5 rounded bg-brand-gold/15 px-3 py-1 font-display text-sm tracking-wider text-brand-gold mt-8"
          >
            <span class="text-xs">★</span>
            {{ badgeText }}
          </span>

          <span
            v-if="estadoBadge"
            class="inline-flex items-center rounded px-3 py-1 font-display text-sm tracking-wider"
            :class="estadoBadge.class"
          >
            {{ estadoBadge.text }}
          </span>
        </div>

        <div v-if="evento" class="flex flex-col gap-3 px-5 pb-5 pt-3">
          <h2 class="font-display text-2xl tracking-widest text-text-heading uppercase md:text-3xl">
            {{ evento.titulo }}
          </h2>

          <p
            v-if="evento.artistas"
            class="font-body text-sm font-medium tracking-wide text-brand-gold-soft"
          >
            {{ evento.artistas }}
          </p>

          <div class="my-1 flex items-center gap-2" aria-hidden="true">
            <span class="h-px flex-1 bg-border-subtle" />
            <span class="text-brand-gold/40 text-sm leading-none">☆</span>
            <span class="h-px flex-1 bg-border-subtle" />
          </div>

          <p class="font-body text-sm leading-relaxed text-text-muted">
            {{ evento.descripcion }}
          </p>

          <div class="mt-2 flex items-center gap-4 text-xs tracking-wide text-text-muted/60 uppercase">
            <span v-if="evento.fecha_hora" class="flex items-center gap-1">
              {{ formatFecha(evento.fecha_inicio) }}
            </span>
            <span v-if="evento.fecha_hora" class="flex items-center gap-1">
              {{ formatHora(evento.fecha_hora) }}
            </span>
            <span class="flex items-center gap-1">
              ● Capacidad máxima: {{ evento.capacidad_max }} personas
            </span>
          </div>

          <a
            v-if="whatsappLink"
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center justify-center gap-2 rounded bg-cta px-6 py-3 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-200 hover:bg-cta-hover active:scale-[0.97]"
          >
            Reservar mesa para este evento
          </a>
        </div>
      </div>
    </template>
  </UModal>
</template>
