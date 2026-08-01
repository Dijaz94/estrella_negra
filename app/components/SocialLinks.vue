<script setup lang="ts">
import type { SocialLink } from '~/types'

defineProps<{
  redes: SocialLink[]
}>()
</script>

<template>
  <section class="px-4 text-center">
    <div class="mb-5 flex items-center justify-center gap-3" aria-hidden="true">
      <span class="h-px w-14 bg-brand-gold/40 md:w-20" />
      <span class="text-lg leading-none text-brand-gold">☆</span>
      <span class="h-px w-14 bg-brand-gold/40 md:w-20" />
    </div>

    <p class="mb-3 font-display text-sm tracking-[0.4em] uppercase text-brand-gold">
      Síguenos
    </p>

    <h2 class="font-display text-3xl leading-none uppercase tracking-widest text-text-heading md:text-5xl">
      La noche<br />
      <span class="text-brand-gold">no termina acá</span>
    </h2>

    <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-muted">
      Lineups, promos y el after que no publicamos en la web. No te pierdas nada.
    </p>

    <div class="mt-10 flex flex-wrap items-start justify-center gap-x-5 gap-y-7">
      <a
        v-for="(red, i) in redes"
        :key="red.id_red"
        :href="red.red_url"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex w-20 flex-col items-center gap-2.5 transition-transform duration-300  focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
        :aria-label="`Abrir ${redSocialMeta(red.nombre).label} en una pestaña nueva`"
        :style="{ '--i': i }"
      >
        <span
          class="red-btn flex h-14 w-14 items-center justify-center rounded-full border border-border-subtle bg-bg-surface text-text-muted transition-colors duration-300"
          :style="{ '--red-color': redSocialMeta(red.nombre).color, '--red-fg': redSocialMeta(red.nombre).fg }"
        >
          <UIcon :name="redSocialMeta(red.nombre).icon" class="h-6 w-6" />
        </span>
        <span class="text-xs tracking-wide text-text-muted transition-colors duration-300 group-hover:text-text-heading">
          {{ redSocialMeta(red.nombre).label }}
        </span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.red-btn {
  animation: btn-enter 0.5s ease-out both;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes btn-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (hover: hover) and (pointer: fine) {
  a.group:hover {
    transform: translateY(-3px);
  }

  a.group:hover .red-btn {
    background: var(--red-color);
    color: var(--red-fg);
    border-color: var(--red-color);
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--red-color) 18%, transparent),
      0 12px 32px -6px color-mix(in srgb, var(--red-color) 45%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .red-btn {
    animation: none;
  }

  a.group,
  a.group .red-btn,
  a.group:hover,
  a.group:hover .red-btn {
    transition: none;
    transform: none;
  }
}
</style>
