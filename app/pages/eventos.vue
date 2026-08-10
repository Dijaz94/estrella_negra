<script setup lang="ts">
import type { EventoPublic } from '~/types';

const { data: eventos, pending, error } = useEvents()
const selectedEvento = ref<EventoPublic | null>(null)
</script>

<template>
  <div class="events-fade-in space-y-16 pb-8">
    <header class="text-center">
      <h1
        class="font-display text-4xl tracking-widest uppercase text-text-heading md:text-5xl"
      >
        Eventos
      </h1>
      <div class="my-4 flex items-center justify-center gap-3" aria-hidden="true">
        <span class="h-px w-8 bg-brand-gold/60" />
        <span class="text-xl text-brand-gold">☆</span>
        <span class="h-px w-8 bg-brand-gold/60" />
      </div>
      <p class="text-text-muted">Próximos eventos en Estrella Negra. </p>
      <p  class="text-text-muted">Selecciona uno para reservar entradas.</p>
    </header>

    <div v-if="pending" class="py-16 text-center">
      <p class="text-text-muted">Cargando eventos…</p>
    </div>

    <div v-else-if="error" class="py-16 text-center">
      <p class="text-text-muted">
        No pudimos cargar los eventos. Intenta de nuevo más tarde.
      </p>
    </div>

    <div v-else-if="!eventos?.length" class="py-16 text-center">
      <p class="text-text-muted">No hay eventos programados por ahora.</p>
    </div>

    <div
      v-else
      class="mx-auto place-items-center grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <CardEventos
      
        v-for="evento in eventos"
        :key="evento.id_evento"
        :evento="evento"
        @click="selectedEvento=evento"
      />
      <EventoModal :evento="selectedEvento" @close="selectedEvento=null"/>
    </div>
  </div>
</template>

<style scoped>
.events-fade-in {
  animation: events-enter 0.5s ease-out both;
}

@keyframes events-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
