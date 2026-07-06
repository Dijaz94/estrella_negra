<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const isActive = (to:string)=>route.path===to

const navigationItems = [
    {label:'Dashboard', to:'/'},
    
    {label:'Eventos', to:'/admin/eventos'},
    {label:'Menú', to:'/admin/menu'},
    {label:'Negocio', to:'/admin/negocio'},
    {label:'Redes Sociales', to:'/admin/redes'},
    {label:'Usuarios', to:'/admin/usuarios'},
]
</script>

<template>
  <div class="flex min-h-screen bg-bg-base text-text-body scrollbar-gutter-stable">
    <aside
      class="flex w-64 flex-col border-r border-border-subtle bg-bg-surface p-4"
    >
      <NuxtLink v-for="page in navigationItems"
        :to="page.to"
        class="mb-8 font-display text-xl tracking-widest uppercase text-text-heading"
      >
        {{ page.label }}
      </NuxtLink>


      <div class="mt-auto pt-4 border-t border-border-subtle">
        <NuxtLink
          to="/"
          class="block rounded px-3 py-2 text-sm text-text-muted hover:text-text-body transition-colors"
        >
          ← Volver al sitio
        </NuxtLink>
      </div>
    </aside>

    <div class="flex-1 overflow-auto p-6">
      <slot />
    </div>
  </div>
</template>
