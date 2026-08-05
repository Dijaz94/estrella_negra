<script setup lang="ts">
import type { EventoPublic } from '~/types'

definePageMeta({
  layout: 'admin'
})

const { data: eventos, refresh } = useAdminEvents()
const toast = useToast()

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingEvento = ref<EventoPublic | null>(null)
const eventoToDelete = ref<EventoPublic | null>(null)
const loading = ref(false)

function openCreate() {
  editingEvento.value = null
  showFormModal.value = true
}

function openEdit(evento: EventoPublic) {
  editingEvento.value = evento
  showFormModal.value = true
}

function openDelete(evento: EventoPublic) {
  eventoToDelete.value = evento
  showDeleteModal.value = true
}

async function handleFormSubmit(data: Record<string, unknown>) {
  loading.value = true
  try {
    if (editingEvento.value) {
      await $fetch(`/api/admin/events/${editingEvento.value.id_evento}`, {
        method: 'PUT',
        body: data,
      })
      toast.add({ title: 'Evento actualizado', color: 'success' })
    } else {
      await createAdminEvent(data)
      toast.add({ title: 'Evento creado', color: 'success' })
    }
    showFormModal.value = false
    editingEvento.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo guardar el evento'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!eventoToDelete.value) return
  loading.value = true
  try {
    await deleteAdminEvent(eventoToDelete.value.id_evento)
    toast.add({ title: 'Evento eliminado', color: 'success' })
    showDeleteModal.value = false
    eventoToDelete.value = null
    


    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: e?.data?.message ?? 'No se pudo eliminar el evento',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}


const estados = [
  { label: 'TODOS', icon: 'i-lucide-layout-grid' },
  { label: 'PROGRAMADO', icon: 'i-lucide-timer' },
  { label: 'FINALIZADO', icon: 'i-lucide-check-circle' },
  { label: 'CANCELADO', icon: 'i-lucide-x-circle' }
]

const estadoFilterIndex = ref(0)
const estadoKeys = [null, 'PROGRAMADO', 'FINALIZADO', 'CANCELADO'] as const
const estadoFilter = computed(() => estadoKeys[estadoFilterIndex.value])

const eventosFiltrados = computed(() => {
  if (!eventos.value) return []
  if (!estadoFilter.value) return eventos.value
  return eventos.value.filter(e => e.estado === estadoFilter.value)
})

</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-display text-2xl tracking-wider uppercase text-text-heading">
        Eventos
      </h1>
      <UButton label="+ Crear evento" @click="openCreate" />
    </div>

    <!-- Filtrado por estado de evento -->

    <UTabs :items="estados" v-model="estadoFilterIndex" class="w-full" />

    <!-- Grid de cards -->
    <div v-if="eventosFiltrados.length" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <CardEventos
        v-for="ev in eventosFiltrados"
        :key="ev.id_evento"
        :evento="ev"
        show-estado
        show-actions
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <!-- Empty state: filtro sin resultados -->
    <div v-else-if="eventos?.length" class="py-16 text-center">
      <p class="font-display text-lg tracking-wider text-text-muted uppercase">
        No hay eventos con este estado
      </p>
      <p class="mt-2 text-sm text-text-muted/60">
        Prueba con otro filtro o creá un nuevo evento.
      </p>
    </div>

    <!-- Empty state: sin eventos -->
    <div v-else class="py-16 text-center">
      <p class="font-display text-lg tracking-wider text-text-muted uppercase">
        No hay eventos creados aún
      </p>
      <p class="mt-2 text-sm text-text-muted/60">
        Haz clic en "Crear evento" para agregar el primero.
      </p>
    </div>

    <!-- Modal crear/editar -->
    <UModal
      v-model:open="showFormModal"
      :title="editingEvento ? 'Editar evento' : 'Crear evento'"
      :ui="{ content: 'max-w-xl w-full max-h-[90vh] overflow-y-auto' }"
    >
      <template #content>
        <AdminEventForm
          :evento="editingEvento"
          :loading="loading"
          @submit="handleFormSubmit"
        />
      </template>
    </UModal>

    <!-- Modal confirmar eliminar -->
    <UModal
      v-model:open="showDeleteModal"
      title="Eliminar evento"
      description="Esta acción no se puede deshacer. El evento se eliminará permanentemente."
      :ui="{ content: 'max-w-md w-full' }"
    >
      <template #content="{ close }">
        <div class="flex flex-col gap-4 p-6">
          <p class="font-body text-sm text-text-muted">
            ¿Estás seguro de que quieres eliminar
            <span class="font-semibold text-text-heading">"{{ eventoToDelete?.titulo }}"</span>?
          </p>
          <div class="flex justify-end gap-3">
            <UButton label="Cancelar" variant="outline" @click="close" />
            <UButton label="Eliminar" color="error" :loading="loading" :disabled="loading" @click="handleDelete" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
