<script setup lang="ts">
import type { BusinessInfo } from '~/types'

const props = defineProps<{
  business: BusinessInfo
}>()

const hoy = computed(() => diaDeHoy())

function esHoy(dia: string): boolean {
  return dia === hoy.value
}
</script>

<template>
  <section class="grid gap-4 md:grid-cols-3">
    <div class="card-hover rounded-lg border border-border-subtle bg-bg-surface p-5 md:p-6">
      <h3 class="font-display mb-2 text-sm tracking-widest uppercase text-brand-gold">
        Ubicación
      </h3>
      <p class="text-sm leading-relaxed text-text-muted">
        {{ business.direccion }}
      </p>
      <a
        :href="`https://maps.google.com/?q=${encodeURIComponent(business.direccion)}`"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-flex items-center gap-1 text-xs text-brand-gold transition-colors hover:text-brand-gold-hover"
      >
        Abrir en Google Maps →
      </a>
    </div>

    <div class="card-hover rounded-lg border border-border-subtle bg-bg-surface p-5 md:p-6">
      <h3 class="font-display mb-3 text-sm tracking-widest uppercase text-brand-gold">
        Horario
      </h3>
      <ul class="space-y-1.5">
        <li
          v-for="d in business.horario"
          :key="d.dia"
          class="flex items-center justify-between rounded px-2 py-1 text-sm transition-colors"
          :class="esHoy(d.dia)
            ? 'border border-brand-gold/30 bg-brand-gold/5 font-medium text-brand-gold'
            : 'text-text-muted'"
        >
          <span class="text-xs" :class="esHoy(d.dia) ? 'text-brand-gold' : ''">
            {{ d.dia }}
          </span>
          <span
            v-if="d.abierto"
            class="text-xs tracking-wide"
            :class="esHoy(d.dia) ? 'text-brand-gold-soft' : ''"
          >
            {{ d.hora_apertura }} — {{ d.hora_cierre }}
          </span>
          <span
            v-else
            class="text-[10px] tracking-wider uppercase text-red-400"
          >
            Cerrado
          </span>
        </li>
      </ul>
    </div>

    <div class="card-hover rounded-lg border border-border-subtle bg-bg-surface p-5 md:p-6">
      <h3 class="font-display mb-2 text-sm tracking-widest uppercase text-brand-gold">
        Contacto
      </h3>
      <div class="space-y-2 text-sm text-text-muted">
        <p v-if="business.telefono" class="flex items-center gap-2">
          <span class="text-xs">📞</span>
          {{ business.telefono }}
        </p>
        <p v-if="business.whatsapp" class="flex items-center gap-2">
          <span class="text-xs">💬</span>
          {{ business.whatsapp }}
        </p>
        <p v-if="business.correo" class="flex items-center gap-2">
          <span class="text-xs">✉</span>
          {{ business.correo }}
        </p>
      </div>
    </div>
  </section>
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
