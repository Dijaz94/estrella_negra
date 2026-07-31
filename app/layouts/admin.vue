<script setup lang="ts">

const route = useRoute()
const isActive = (to:string)=>route.path===to

const isSidebarOpen = ref(false)

watch(() => route.path, () => { isSidebarOpen.value = false })

const navigationItems = [
    {label:'Dashboard', to:'/admin/dashboard'},
    {label:'Eventos', to:'/admin/eventos'},
    {label:'Menú', to:'/admin/menu'},
    {label:'Negocio', to:'/admin/negocio'},
    {label:'Usuarios', to:'/admin/usuarios'},
]

const { data: business } = useBusiness()

async function handleLogout() {
  await $fetch('/api/admin/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

</script>

<template>
  <div class="flex h-screen bg-bg-base text-text-body overflow-hidden">
    <!-- Hamburger mobile -->
    <button
      class="fixed top-4 left-4 z-50 rounded-lg border border-border-subtle bg-bg-surface p-2 sm:hidden"
      @click="isSidebarOpen = !isSidebarOpen"
    >
      <UIcon name="i-lucide-menu" />
    </button>

    <!-- Backdrop mobile -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity duration-300"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="flex w-64 flex-col border-r border-border-subtle bg-bg-surface p-4
             fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
             sm:relative sm:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'"
    >
      <NuxtLink
            to="/"
            class="font-display text-xl tracking-widest uppercase text-text-heading mb-7 pl-10 sm:pl-0"
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
          class="flex rounded text-left text-sm text-cta/70 hover:text-cta hover:bg-cta/5 transition-colors items-center"
          icon="i-lucide-log-out"
        >
          Cerrar sesión
        </UButton>
      </div>
    </aside>

    <div class="flex-1 p-6 pt-16 sm:pt-6" style="overflow-y: scroll">
      <slot />
    </div>
  </div>
</template>
