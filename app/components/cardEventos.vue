<script setup lang="ts">
import type { EventoPublic } from '~/types';

const props = defineProps<{
evento: EventoPublic
}>()

</script>

<template>
    <article
    class="card-hover group flex flex-col max-w-sm md:max-w-xl lg:max-w-2xl overflow-hidden rounded-lg border border-border-subtle bg-bg-surface"
  >
    <!-- Imagen -->
    <div
      v-if="evento.afiche_url"
      class="relative aspect-video overflow-hidden -cover"
    >
      <img
        :src="evento.afiche_url"
        :alt="evento.titulo"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105 border-2 border-brand-gold-soft rounded-lg"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-t from-bg-surface/60 to-transparent" />
    </div>

    <!-- Fecha -->
    <div
      class="flex items-center gap-2 mx-5 mt-4"
      :class="{ '-mt-10': evento.afiche_url }"
    >
      <span class="inline-flex items-center gap-1.5 rounded bg-brand-gold/15 px-3 py-1 font-display text-sm tracking-wider text-brand-gold">
        <span class="text-xs">★</span>
        {{ formatFecha(evento.fecha_inicio) }}
      </span>
    </div>

    <!-- Cuerpo -->
    <div class="flex flex-col gap-2 px-5 pb-5 pt-3">
      <h3 class="font-display text-xl tracking-wider text-text-heading uppercase md:text-2xl">
        {{ evento.titulo }}
      </h3>

      <p
        v-if="evento.artistas"
        class="font-body text-sm font-medium tracking-wide text-brand-gold-soft"
      >
        {{ evento.artistas }}
      </p>

      <!-- Separador ☆ -->
      <div class="my-1 flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <p class="line-clamp-2 font-body text-sm leading-relaxed text-text-muted">
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
    </div>
  </article>
</template>