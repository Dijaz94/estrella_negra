<script setup lang="ts">
import type { SocialLink } from '~/types'

defineProps<{
  redes: SocialLink[]
}>()
</script>

<template>
  <section>
    <h2 class="font-display mb-6 text-center text-lg tracking-widest uppercase text-brand-gold md:text-xl">
      Síguenos
    </h2>
    <div class="flex flex-wrap justify-center gap-3">
      <a
        v-for="red in redes"
        :key="red.id_red"
        :href="red.red_url"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-5 py-2 text-sm text-text-muted transition-all duration-200 hover:border-brand-gold hover:text-brand-gold active:scale-[0.97]"
      >
        {{ red.nombre }}
      </a>
    </div>
  </section>
</template>
