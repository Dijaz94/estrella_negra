<script setup lang="ts">
import type { BusinessInfo } from '~/types'

const props = defineProps<{
  business: BusinessInfo
}>()

const hoy = computed(() => horarioDeHoy(props.business.horario))
</script>

<template>
  <section class="relative flex min-h-[80dvh] items-center justify-center overflow-hidden">
    <div
      v-if="business.banner_url"
      class="absolute inset-0 -z-10"
    >
      <img
        :src="business.banner_url"
        :alt="business.nombre_local"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-b from-bg-base/70 via-bg-base/60 to-bg-base" />
    </div>

    <div class="hero-fade-in text-center">
      <h1 class="font-display text-5xl tracking-widest uppercase text-text-heading md:text-7xl lg:text-8xl">
        <span class="block">Estrella</span>
        <span class="-mt-2 block">Negra</span>
      </h1>

      <div class="my-6 flex items-center justify-center gap-3 md:my-8" aria-hidden="true">
        <span class="h-px w-12 bg-brand-gold/60 md:w-20" />
        <span class="text-brand-gold text-2xl leading-none md:text-3xl">☆</span>
        <span class="h-px w-12 bg-brand-gold/60 md:w-20" />
      </div>

      <p class="mx-auto max-w-xl px-4 text-lg leading-relaxed text-text-muted md:text-lg">
        {{ business.descripcion }}
      </p>

      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <a
          v-if="business.whatsapp"
          :href="`https://wa.me/${business.whatsapp}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded bg-cta px-6 py-3 text-sm font-semibold tracking-wider uppercase text-white transition-all duration-200 hover:bg-cta-hover active:scale-[0.97]"
        >
          Reservar
        </a>
        <a
          v-if="business.direccion"
          :href="`https://maps.google.com/?q=${encodeURIComponent(business.direccion)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded border border-border-strong px-6 py-3 text-sm font-semibold tracking-wider uppercase text-text-muted transition-all duration-200 hover:border-brand-gold hover:text-brand-gold active:scale-[0.97]"
        >
          Ver ubicación
        </a>
      </div>

      <div class="mt-8 flex flex-col items-center justify-center gap-4 text-sm  text-text-muted md:text-base">
        <span v-if="business.direccion" class="flex items-center gap-1.5 text-base">
          📍 {{ business.direccion }} 
        </span>
        <span
          v-if="business.horario?.length"
          class="flex items-center gap-1.5 text-base"
          :class="{ 'text-brand-gold': hoy && hoy.abierto }"
        >
          <span
            class="inline-block h-1.5 w-1.5 rounded-full"
            :class="hoy?.abierto ? 'bg-green-500' : 'bg-red-500'"
          />
          {{ hoy ? (hoy.abierto ? `Abierto hoy — ${hoy.hora_apertura} a ${hoy.hora_cierre}` : 'Cerrado hoy') : '' }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-fade-in {
  animation: hero-enter 0.6s ease-out both;
}

@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
