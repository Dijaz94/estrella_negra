<script setup lang="ts">
import type { EventoPublic } from '~/types'

definePageMeta({
  layout: 'admin',
})

const { data: stats } = useAdminStats()
const { data: eventos } = useAdminEvents()

const proximos = computed(() =>
  (eventos.value ?? [])
    .filter(
      (e) =>
        e.estado === 'PROGRAMADO' &&
        new Date(e.fecha_inicio) >= new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.fecha_inicio).getTime() -
        new Date(b.fecha_inicio).getTime(),
    ),
)

const nextEvento = computed<EventoPublic | undefined>(
  () => proximos.value[0],
)

const topProximos = computed(() => proximos.value.slice(0, 5))

function formatMarqueeDate(fecha: string) {
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return '-'
  return (
    new Intl.DateTimeFormat('es-CL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(d) +
    ' · ' +
    formatHora(fecha)
  )
}

function formatCreated(fecha: string) {
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return '-'
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(d)
}

function estadoBadgeClass(estado: string) {
  switch (estado) {
    case 'PROGRAMADO':
      return 'bg-brand-gold/15 text-brand-gold'
    case 'CANCELADO':
      return 'bg-red-500/15 text-red-400'
    case 'FINALIZADO':
      return 'bg-text-muted/15 text-text-muted'
    default:
      return ''
  }
}
</script>

<template>
  <div class="dashboard-fade-in flex flex-col gap-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1
        class="font-display text-2xl tracking-wider uppercase text-text-heading"
      >
        Dashboard
      </h1>
      <UButton
        label="Crear evento"
        icon="i-lucide-calendar-plus"
        class="font-display uppercase tracking-wider"
        to="/admin/eventos"
      />
    </div>

    <!-- Marquee: Próxima fecha -->
    <div
      v-if="nextEvento"
      class="relative overflow-hidden rounded-lg border border-border-subtle border-l-2 border-l-brand-gold bg-bg-surface p-6 md:p-8"
    >
      <div class="flex items-center gap-2 mb-3">
        <span class="text-brand-gold text-lg leading-none" aria-hidden="true">★</span>
        <span
          class="font-display text-xs tracking-[0.3em] uppercase text-brand-gold"
        >
          Próxima fecha
        </span>
      </div>
      <h2
        class="font-display text-3xl tracking-wider uppercase text-text-heading md:text-4xl"
      >
        {{ nextEvento.titulo }}
      </h2>
      <p
        v-if="nextEvento.artistas"
        class="mt-1 font-body text-sm tracking-wide text-brand-gold-soft"
      >
        {{ nextEvento.artistas }}
      </p>
      <p class="mt-2 text-sm text-text-muted">
        {{ formatMarqueeDate(nextEvento.fecha_inicio) }}
      </p>
    </div>

    <div
      v-else
      class="rounded-lg border border-border-subtle border-l-2 border-l-brand-gold/40 bg-bg-surface p-6 md:p-8"
    >
      <div class="flex items-center gap-2 mb-3">
        <span class="text-brand-gold/40 text-lg leading-none" aria-hidden="true">★</span>
        <span
          class="font-display text-xs tracking-[0.3em] uppercase text-brand-gold/60"
        >
          Próxima fecha
        </span>
      </div>
      <p class="text-lg text-text-muted">Sin fechas confirmadas</p>
      <UButton
        label="Crear evento"
        variant="outline"
        icon="i-lucide-plus"
        class="mt-3 font-display uppercase tracking-wider"
        to="/admin/eventos"
      />
    </div>

    <!-- KPIs: Eventos -->
    <section>
      <h2
        class="font-display mb-3 text-sm uppercase tracking-widest text-text-muted"
      >
        Eventos
      </h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <AdminStatCard label="Totales" :value="stats?.totalEventos ?? '—'" />
        <AdminStatCard label="Próximos" :value="stats?.eventosProximos ?? '—'" />
        <AdminStatCard
          label="Finalizados"
          :value="stats?.eventosFinalizados ?? '—'"
          accent="muted"
        />
        <AdminStatCard
          label="Cancelados"
          :value="stats?.eventosCancelados ?? '—'"
          accent="error"
        />
      </div>
    </section>

    <!-- KPIs: Menú -->
    <section>
      <h2
        class="font-display mb-3 text-sm uppercase tracking-widest text-text-muted"
      >
        Menú
      </h2>
      <div class="grid grid-cols-3 gap-3">
        <AdminStatCard
          label="Categorías"
          :value="stats?.totalCategorias ?? '—'"
        />
        <AdminStatCard
          label="Productos"
          :value="stats?.totalProductos ?? '—'"
        />
        <AdminStatCard
          label="Disponibles"
          :value="stats?.productosDisponibles ?? '—'"
        />
      </div>
    </section>

    <!-- KPIs: Cuenta -->
    <section>
      <h2
        class="font-display mb-3 text-sm uppercase tracking-widest text-text-muted"
      >
        Cuenta
      </h2>
      <div class="grid grid-cols-3 gap-3">
        <AdminStatCard
          label="Usuarios"
          :value="stats?.totalUsuarios ?? '—'"
        />
        <AdminStatCard
          label="Activos"
          :value="stats?.usuariosActivos ?? '—'"
        />
        <AdminStatCard
          label="Redes"
          :value="stats?.totalRedes ?? '—'"
        />
      </div>
    </section>

    <!-- Lists: Próximos eventos + Últimos registros -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Próximos eventos -->
      <section class="flex flex-col rounded-lg border border-border-subtle bg-bg-surface p-5">
        <h2
          class="font-display mb-4 text-sm uppercase tracking-widest text-text-muted"
        >
          Próximos eventos
        </h2>
        <ul v-if="topProximos.length" class="space-y-3">
          <li
            v-for="ev in topProximos"
            :key="ev.id_evento"
            class="flex items-center justify-between gap-3 rounded border border-border-subtle/50 bg-bg-base px-3 py-2.5"
          >
            <div class="min-w-0 flex-1">
              <p
                class="font-display text-base tracking-wider uppercase text-text-heading truncate"
              >
                {{ ev.titulo }}
              </p>
              <p class="text-xs text-text-muted">
                {{ formatFecha(ev.fecha_inicio) }} · {{ formatHora(ev.fecha_hora) }}
              </p>
            </div>
            <span
              class="inline-flex shrink-0 items-center rounded px-2 py-0.5 font-display text-xs tracking-wider"
              :class="estadoBadgeClass(ev.estado)"
            >
              {{ ev.estado }}
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-text-muted">Sin eventos programados</p>
      </section>

      <!-- Últimos registros -->
      <section class="flex flex-col rounded-lg border border-border-subtle bg-bg-surface p-5">
        <h2
          class="font-display mb-4 text-sm uppercase tracking-widest text-text-muted"
        >
          Últimos registros
        </h2>
        <ul v-if="stats?.ultimosEventos?.length" class="space-y-3">
          <li
            v-for="ev in stats.ultimosEventos"
            :key="ev.id_evento"
            class="flex items-center justify-between gap-3 rounded border border-border-subtle/50 bg-bg-base px-3 py-2.5"
          >
            <div class="min-w-0 flex-1">
              <p
                class="font-display text-base tracking-wider uppercase text-text-heading truncate"
              >
                {{ ev.titulo }}
              </p>
              <p class="text-xs text-text-muted">
                Creado {{ formatCreated(ev.created_at) }}
              </p>
            </div>
            <span
              class="inline-flex shrink-0 items-center rounded px-2 py-0.5 font-display text-xs tracking-wider"
              :class="estadoBadgeClass(ev.estado)"
            >
              {{ ev.estado }}
            </span>
          </li>
        </ul>
        <p v-else class="text-sm text-text-muted">Aún no hay actividad</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard-fade-in {
  animation: dash-enter 0.5s ease-out both;
}

@keyframes dash-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-fade-in {
    animation: none;
  }
}
</style>
