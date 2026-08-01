<script setup lang="ts">
const route = useRoute()
const isActive = (to:string)=>route.path===to

const navigationItems = [
    {label:'Inicio', to:'/'},
    {label:'Menú', to:'/menu'},
    {label:'Eventos', to:'/eventos'}
]
const { data: business } = useBusiness()
</script>

<template>
  <div class=" flex flex-col min-h-screen bg-bg-base/40 text-text-body scrollbar-gutter-stable">
    <header
      class="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/80 backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NuxtLink
          to="/"
          class="font-display text-xl tracking-widest uppercase text-text-heading"
        >
          <img
            v-if="business?.logo_url"
            :src="business.logo_url"
            :alt="business.nombre_local"
            class="h-10 w-auto"
          />
          <span v-else>{{ business?.nombre_local ?? 'Estrella Negra' }}</span>
        </NuxtLink>

        <nav class="flex items-center gap-6 text-sm tracking-wider uppercase">
          <NuxtLink v-for="page in navigationItems" :key="page.to" :to="page.to" class="hover:text-brand-gold transition-colors p-2" :class="isActive(page.to)?'border-b-2 border-brand-gold':''">
            {{ page.label }}
          </NuxtLink>
          
          <a
            v-if="business?.whatsapp"
            :href="`https://wa.me/${business.whatsapp}`"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded bg-cta px-3 py-1.5 text-sm font-semibold text-white hover:bg-cta-hover transition-colors"
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 py-8 grow">
      <slot />
    </main>

    <footer
      class="border-t border-border-subtle bg-bg-surface py-8 text-center text-sm text-text-muted "
    >
      <div class="mx-auto max-w-6xl px-4">
        <div v-if="business" class="mb-4 flex items-center justify-center gap-4">
          <span>{{ business.nombre_local }}</span>
          <span class="text-border-strong">•</span>
          <a
            v-if="business.direccion"
            :href="`https://maps.google.com/?q=${encodeURIComponent(business.direccion)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-brand-gold transition-colors"
          >
            {{ business.direccion }}
          </a>
        </div>

        <div
          v-if="business?.redes?.length"
          class="mb-4 flex items-center justify-center gap-4"
        >
          <a
            v-for="red in business.redes"
            :key="red.id_red"
            :href="red.red_url"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-brand-gold transition-colors"
          >
            {{ red.nombre }}
          </a>
        </div>

        <p>&copy; {{ new Date().getFullYear() }} Estrella Negra. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>
