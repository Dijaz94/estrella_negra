<script setup lang="ts">


const route = useRoute()
const isActive = (to:string)=>route.path===to

const navigationItems = [
    {label:'Dashboard', to:'/admin/dashboard'},
    
    {label:'Eventos', to:'/admin/eventos'},
    {label:'Menú', to:'/admin/menu'},
    {label:'Negocio', to:'/admin/negocios'},
    {label:'Redes Sociales', to:'/admin/redes'},
    {label:'Usuarios', to:'/admin/usuarios'},
]

const { data: business } = useBusiness()

async function handleLogout() {
  await $fetch('/api/admin/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

</script>

<template>
  <div class="flex min-h-screen bg-bg-base text-text-body scrollbar-gutter-stable">
    <aside
      class="flex w-64 flex-col border-r border-border-subtle bg-bg-surface p-4"
    >
    <NuxtLink
          to="/"
          class="font-display text-xl tracking-widest uppercase text-text-heading mb-7"
        >
          <img
            v-if="business?.logo_url"
            :src="business.logo_url"
            :alt="business.nombre_local"
            class="h-10 w-auto"
          />
          <span v-else>{{ business?.nombre_local ?? 'Estrella Negra' }}</span>
        </NuxtLink>
      <NuxtLink v-for="page in navigationItems"
        :to="page.to"
        class="rounded-lg mb-8 font-display text-xl tracking-widest uppercase text-text-heading hover:scale-110 duration-200 p-2" :class="isActive(page.to)?'border-b-2 border-brand-gold':''"
      >
        {{ page.label }}
      </NuxtLink>


      <div class="mt-auto pt-4 border-t border-border-subtle flex flex-col gap-1">
        <NuxtLink
          to="/"
          class="block rounded px-3 py-2 text-sm text-text-muted hover:text-text-body transition-colors"
        >
          ← Volver al sitio
        </NuxtLink>
        <UButton
          @click="handleLogout"
          class="block rounded px-3 py-2 text-left text-sm text-cta/70 hover:text-cta hover:bg-cta/5 transition-colors"
          icon="i-lucide-logOut"
        >
          Cerrar sesión
        </UButton>
      </div>
    </aside>

    <div class="flex-1 overflow-auto p-6">
      <slot />
    </div>
  </div>
</template>
