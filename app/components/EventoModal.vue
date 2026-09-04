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

// Bloque calendario compartido con la card
const calendario = computed(() => {
  const date = props.evento ? new Date(props.evento.fecha_inicio) : null
  if (!date || isNaN(date.getTime())) return null
  const diaSemana = new Intl.DateTimeFormat('es-CL', { weekday: 'long', timeZone: 'UTC' }).format(date)
  const diaNum = new Intl.DateTimeFormat('es-CL', { day: '2-digit', timeZone: 'UTC' }).format(date)
  const mes = new Intl.DateTimeFormat('es-CL', { month: 'long', timeZone: 'UTC' }).format(date)
  return { diaSemana, diaNum, mes }
})

function formatPrecio(v: number) {
  return `$${v.toLocaleString('es-CL')}`
}

// Sección Entrada: preventa / puerta o gratuita
const precioInfo = computed(() => {
  if (!props.evento) return null
  const { precio_preventa, precio_puerta } = props.evento

  if (precio_preventa != null || precio_puerta != null) {
    return {
      preventa: precio_preventa != null ? formatPrecio(precio_preventa) : null,
      puerta: precio_puerta != null ? formatPrecio(precio_puerta) : null,
      libre: false,
    }
  }
  return { libre: true }
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
      <div class="relative flex flex-col overflow-hidden">
        <UButton
          @click="close"
          icon="i-lucide-x"
          variant="outline"
          class="absolute top-3 right-3 z-20 h-8 w-8 rounded-xl"
        />

        <!-- Header / hero -->
        <div
          v-if="evento"
          class="relative overflow-hidden"
        >
          <img
            :src="evento.afiche_url || '/images/default_event.jpg'"
            :alt="evento.titulo"
            class="h-auto w-full"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-linear-to-t from-bg-surface/85 via-bg-surface/10 to-transparent" />

          <div
            v-if="calendario"
            class="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-3 px-5 pb-3"
          >
            <span
              class="inline-flex flex-col rounded-md border border-brand-gold/40 bg-bg-surface/85 px-4 py-2 backdrop-blur-sm"
            >
              <span class="font-display text-xs tracking-[0.3em] text-brand-gold uppercase">
                {{ calendario.diaSemana }}
              </span>
              <span class="font-display text-sm tracking-wider text-text-heading uppercase">
                {{ calendario.diaNum }} · {{ calendario.mes }}
              </span>
              <span
                v-if="evento.fecha_fin"
                class="font-display text-[10px] tracking-[0.2em] text-text-muted uppercase"
              >
                hasta {{ formatFecha(evento.fecha_fin) }}
              </span>
            </span>
            <span
              v-if="estadoBadge"
              class="inline-flex items-center rounded px-3 py-1 font-display text-sm tracking-wider"
              :class="estadoBadge.class"
            >
              {{ estadoBadge.text }}
            </span>
          </div>
        </div>

        <div v-if="evento" class="flex flex-col gap-3 px-5 pt-4 pb-5">
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

          <!-- Sección Entrada -->
          <div class="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface-alt px-4 py-3">
            <span class="font-display text-xs tracking-[0.25em] text-text-muted uppercase">Entrada</span>
            <template v-if="precioInfo && !precioInfo.libre">
              <span v-if="precioInfo.preventa" class="flex flex-col leading-none">
                <span class="text-[10px] tracking-wider text-text-muted uppercase">Preventa</span>
                <span class="font-display text-lg text-brand-gold tabular-nums">{{ precioInfo.preventa }}</span>
              </span>
              <span
                v-if="precioInfo.preventa && precioInfo.puerta"
                class="h-8 w-px bg-border-subtle"
                aria-hidden="true"
              />
              <span v-if="precioInfo.puerta" class="flex flex-col leading-none">
                <span class="text-[10px] tracking-wider text-text-muted uppercase">En puerta</span>
                <span class="font-display text-lg text-brand-gold tabular-nums">{{ precioInfo.puerta }}</span>
              </span>
            </template>
            <span v-else class="font-display text-lg tracking-wider text-brand-gold uppercase">
              Entrada gratuita
            </span>

            <div class="ml-auto flex items-center gap-4 text-xs tracking-wide text-text-muted/60 uppercase">
              <span v-if="evento.fecha_hora" class="flex items-center gap-1.5">
                <span class="i-lucide-clock h-3.5 w-3.5" aria-hidden="true" />
                {{ formatHora(evento.fecha_hora) }}
              </span>
              <span class="flex items-center gap-1.5" :title="`Capacidad máxima: ${evento.capacidad_max} personas`">
                <span class="i-lucide-users h-3.5 w-3.5" aria-hidden="true" />
                {{ evento.capacidad_max }} cupos
              </span>
            </div>
          </div>

          <a
            v-if="whatsappLink"
            :href="whatsappLink"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex items-center justify-center gap-2 rounded bg-cta px-6 py-3 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-200 hover:bg-cta-hover active:scale-[0.97]"
          >
            Reservar mesa para este evento
          </a>
        </div>
      </div>
    </template>
  </UModal>
</template>
