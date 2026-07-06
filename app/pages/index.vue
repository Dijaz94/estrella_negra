<script setup lang="ts">
const { data: business } = useBusiness()
</script>

<template>
  <div v-if="business" class="space-y-16 pb-16 md:space-y-24 md:pb-24">
    <HeroSection :business="business" />

    <BusinessInfo :business="business" />

    <section class="text-center">
      <NuxtLink
        to="/menu"
        class="inline-flex items-center gap-2 rounded border border-brand-gold/40 px-8 py-3 font-display text-base font-semibold tracking-widest uppercase text-brand-gold transition-all duration-200 hover:bg-brand-gold/10 active:scale-[0.97]"
      >
        Ver menú completo
      </NuxtLink>
    </section>

    <SocialLinks v-if="business.redes?.length" :redes="business.redes" />
  </div>

  <div v-else class="flex min-h-[50dvh] items-center justify-center">
    <p class="text-sm text-text-muted">Cargando...</p>
  </div>
</template>
