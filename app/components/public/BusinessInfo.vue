<script setup lang="ts">
import type { BusinessInfo } from '~/types'

defineProps<{
  business: BusinessInfo
}>()
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
    </div>

    <div class="card-hover rounded-lg border border-border-subtle bg-bg-surface p-5 md:p-6">
      <h3 class="font-display mb-2 text-sm tracking-widest uppercase text-brand-gold">
        Horario
      </h3>
      <p class="text-sm leading-relaxed text-text-muted">
        {{ business.horario }}
      </p>
    </div>

    <div class="card-hover rounded-lg border border-border-subtle bg-bg-surface p-5 md:p-6">
      <h3 class="font-display mb-2 text-sm tracking-widest uppercase text-brand-gold">
        Contacto
      </h3>
      <div class="space-y-1 text-sm text-text-muted">
        <p v-if="business.telefono">{{ business.telefono }}</p>
        <p v-if="business.correo">{{ business.correo }}</p>
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
