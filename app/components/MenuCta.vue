<template>
  <section class=" border-y border-border-subtle px-4 py-16 text-center md:py-20">
    <p class="mb-4 font-display text-sm tracking-[0.4em] uppercase text-brand-gold">
      Para abrir el apetito
    </p>

    <h2 class="font-display text-3xl uppercase tracking-widest text-text-heading md:text-5xl">
      Lo que nunca falta<br />
      <span class="text-brand-gold">en la noche</span>
    </h2>

    <div class="my-7 flex items-center justify-center gap-3" aria-hidden="true">
      <span class="h-px w-8 bg-brand-gold/60" />
      <span class="text-xl text-brand-gold">☆</span>
      <span class="h-px w-8 bg-brand-gold/60" />
    </div>

    <NuxtLink
      to="/menu"
      class="group inline-flex items-center gap-2 rounded bg-cta px-8 py-3.5 font-display text-base font-semibold tracking-widest uppercase text-white transition-all duration-200 hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold active:scale-[0.97]"
    >
      Ver menú completo
      <UIcon
        name="i-lucide-arrow-right"
        class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      />
    </NuxtLink>
  </section>
</template>

