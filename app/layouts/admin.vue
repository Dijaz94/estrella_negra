<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
</script>

<template>
  <div class="flex min-h-screen bg-bg-base text-text-body">
    <aside
      class="flex w-64 flex-col border-r border-border-subtle bg-bg-surface p-4"
    >
      <NuxtLink
        to="/admin/dashboard"
        class="mb-8 font-display text-xl tracking-widest uppercase text-text-heading"
      >
        Admin
      </NuxtLink>

      <nav class="flex flex-col gap-1 text-sm">
        <NuxtLink
          to="/admin/dashboard"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          to="/admin/eventos"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Eventos
        </NuxtLink>
        <NuxtLink
          to="/admin/menu"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Menú
        </NuxtLink>
        <NuxtLink
          to="/admin/negocios"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Negocio
        </NuxtLink>
        <NuxtLink
          to="/admin/redes"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Redes Sociales
        </NuxtLink>
        <NuxtLink
          to="/admin/usuarios"
          class="rounded px-3 py-2 hover:bg-bg-surface-alt transition-colors"
        >
          Usuarios
        </NuxtLink>
      </nav>

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
