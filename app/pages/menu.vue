<script setup lang="ts">
import type { CategoryItem } from '~/types'

const { data: menu, pending, refresh } = useMenu()

const categorias = computed<CategoryItem[]>(() => menu.value ?? []) //inicia en arreglo vacío para que no se rompa

const searchQuery = ref('')
const activeId = ref<number | 'destacados' | null>(null)

const filteredCategorias = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return categorias.value //si no se ha escrito nada son todas las categorias

  return categorias.value //retorna las categorias que pasan por el mapeo y el filtro
    .map(cat => ({
      ...cat,
      productos: cat.productos.filter(p =>
        (p.nombre ?? '').toLowerCase().includes(q) //todas las categorias que cumplan con que el producto tenga incluido el texto ingresado por el usuario
      )
    }))
    .filter(cat => cat.productos.length > 0) //la categoría debe tener al menos un producto
})

const destacados = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return categorias.value
    .flatMap(cat => cat.productos)
    .filter(p => p.destacado && p.disponible)
    .filter(p => !q || (p.nombre ?? '').toLowerCase().includes(q) || (p.descripcion ?? '').toLowerCase().includes(q))
})

function scrollTo(id: number | 'destacados') {
  activeId.value = id
  document.getElementById('seccion-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let observer: IntersectionObserver | null = null

function rebuildObserver() {
  observer?.disconnect()
  if (!categorias.value.length && !destacados.value.length) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const rawId = (entry.target as HTMLElement).dataset.categoryId
          activeId.value = rawId === 'destacados' ? 'destacados' : Number(rawId)
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px' },
  )
  document.querySelectorAll<HTMLElement>('[data-category-id]').forEach(el => observer!.observe(el))
}

watch([filteredCategorias, destacados], () => {
  if (destacados.value.length) {
    activeId.value = 'destacados'
  } else {
    const cats = filteredCategorias.value
    activeId.value = cats[0] ? cats[0].id_categoria : null
  }
  nextTick(rebuildObserver) //espera a que se actualice el DOM para correr rebuildObserver
})

onMounted(() => {
  refresh()
  nextTick(rebuildObserver)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div class="menu-fade-in space-y-16 pb-8">
    <header class="text-center">
      <h1 class="font-display text-4xl tracking-widest uppercase text-text-heading md:text-5xl">
        Menú
      </h1>
      <div class="my-4 flex items-center justify-center gap-3" aria-hidden="true">
        <span class="h-px w-8 bg-brand-gold/60" />
        <span class="text-xl text-brand-gold">☆</span>
        <span class="h-px w-8 bg-brand-gold/60" />
      </div>
    </header>

    <nav
      v-if="categorias.length > 1 || searchQuery"
      class="sticky top-16 z-40 -mx-4 mb-8 border-y border-border-subtle bg-bg-base/90 px-4 py-3 backdrop-blur-md"
    >
      <div class="relative mb-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar en el menú…"
          class="w-full rounded border border-border-subtle bg-bg-surface-alt px-3 py-2 text-sm text-text-body font-semibold placeholder:text-text-muted outline-none transition-colors focus:border-brand-gold/60"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-text-muted hover:text-text-body"
        >✕</button>
      </div>

      <div
        v-if="filteredCategorias.length > 1 || destacados.length > 0"
        class="flex items-center justify-[safe_center] gap-6 overflow-x-auto text-sm tracking-widest uppercase"
      >
        <button
          v-if="destacados.length > 0"
          @click="scrollTo('destacados')"
          class="shrink-0 transition-colors flex items-center gap-1.5 hover:text-brand-gold"
          :class="activeId === 'destacados' ? 'text-brand-gold font-semibold' : 'text-text-muted'"
        >
          <span>★</span> Destacados
        </button>
        <button
          v-for="cat in filteredCategorias"
          :key="cat.id_categoria"
          @click="scrollTo(cat.id_categoria)"
          class="shrink-0 transition-colors hover:text-brand-gold"
          :class="activeId === cat.id_categoria ? 'text-brand-gold font-semibold' : 'text-text-muted'"
        >
          {{ cat.nombre }}
        </button>
      </div>
    </nav>

    <div
      v-if="searchQuery && !filteredCategorias.length && !destacados.length"
      class="py-16 text-center text-text-muted"
    >
      No encontramos nada para "{{ searchQuery }}"
    </div>

    <!-- Sección Destacados de la Casa -->
    <section
      v-if="destacados.length > 0"
      id="seccion-destacados"
      data-category-id="destacados"
      class="mx-auto max-w-2xl scroll-mt-44"
    >
      <div class="mb-4 flex items-center justify-center gap-2">
        <span class="text-xs text-brand-gold">★</span>
        <span class="font-display text-xs tracking-[0.3em] uppercase text-brand-gold">Selección especial</span>
        <span class="text-xs text-brand-gold">★</span>
      </div>

      <h2 class="font-display mb-6 text-center text-2xl tracking-widest uppercase text-brand-gold">
        Recomendados de la Casa
      </h2>

      <ul class="space-y-6">
        <li
          v-for="prod in destacados"
          :key="'destacado-' + prod.id_producto"
          class="border-b border-border-subtle/80 pb-5 last:border-0 last:pb-0"
        >
          <div class="flex items-start gap-4">
            <img
              v-if="prod.imagen_url"
              :src="prod.imagen_url"
              :alt="prod.nombre"
              class="mt-0.5 h-16 w-16 shrink-0 rounded object-cover ring-1 ring-brand-gold/30 sm:h-20 sm:w-20"
              loading="lazy"
            />
            <div class="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-brand-gold" aria-label="Destacado">★</span>
                  <h3 class="font-display text-base tracking-wider uppercase text-text-heading">
                    {{ prod.nombre }}
                  </h3>
                  <span
                    v-if="prod.categoria"
                    class="hidden rounded bg-bg-surface-alt px-2 py-0.5 text-[10px] tracking-wider text-text-muted uppercase sm:inline-block"
                  >
                    {{ prod.categoria }}
                  </span>
                </div>
                <p
                  v-if="prod.descripcion"
                  class="mt-1 text-sm leading-relaxed text-text-muted"
                >
                  {{ prod.descripcion }}
                </p>
              </div>
              <span class="shrink-0 font-body text-base font-semibold text-brand-gold tabular-nums">
                ${{ prod.precio.toLocaleString('es-CL') }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- Separador tras destacados si hay categorías -->
    <div
      v-if="destacados.length > 0 && filteredCategorias.length > 0"
      class="my-8 flex items-center justify-center gap-3"
      aria-hidden="true"
    >
      <span class="h-px w-10 bg-brand-gold/30" />
      <span class="text-sm text-brand-gold/50">☆</span>
      <span class="h-px w-10 bg-brand-gold/30" />
    </div>

    <section
      v-for="(cat, i) in filteredCategorias"
      :key="cat.id_categoria"
      :id="'seccion-' + cat.id_categoria"
      :data-category-id="cat.id_categoria"
      class="mx-auto max-w-2xl scroll-mt-44"
    >
      <div
        v-if="i > 0"
        class="mb-12 flex items-center justify-center gap-3"
        aria-hidden="true"
      >
        <span class="h-px w-6 bg-brand-gold/40" />
        <span class="text-lg text-brand-gold/60">☆</span>
        <span class="h-px w-6 bg-brand-gold/40" />
      </div>

      <h2 class="font-display mb-6 text-center text-xl tracking-widest uppercase text-brand-gold">
        {{ cat.nombre }}
      </h2>

      <ul class="space-y-5">
        <li
          v-for="prod in cat.productos"
          :key="prod.id_producto"
          class="border-b border-border-subtle pb-4"
          :class="{ 'opacity-40': !prod.disponible }"
        >
          <div class="flex items-start gap-4">
            <img
              v-if="prod.imagen_url"
              :src="prod.imagen_url"
              :alt="prod.nombre"
              class="mt-0.5 h-16 w-16 shrink-0 rounded object-cover ring-1 ring-border-subtle sm:h-20 sm:w-20"
              loading="lazy"
            />
            <div class="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span
                    v-if="prod.destacado"
                    class="text-sm text-brand-gold"
                    aria-label="Destacado"
                  >★</span>
                  <h3
                    class="font-display text-base tracking-wider uppercase text-text-heading"
                    :class="{ 'line-through': !prod.disponible }"
                  >
                    {{ prod.nombre }}
                  </h3>
                </div>
                <p
                  v-if="prod.descripcion"
                  class="mt-1 text-sm leading-relaxed text-text-muted"
                >
                  {{ prod.descripcion }}
                </p>
              </div>
              <span class="shrink-0 font-body text-base text-text-body tabular-nums">
                ${{ prod.precio ?? '-' }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <div v-if="!pending && menu?.length == 0" class="py-16 text-center">
      <p class="text-text-muted">El menú se está actualizando.</p>
    </div>
  </div>
</template>

<style scoped>
.menu-fade-in {
  animation: menu-enter 0.5s ease-out both;
}

@keyframes menu-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
