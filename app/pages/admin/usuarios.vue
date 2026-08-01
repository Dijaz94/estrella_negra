<script setup lang="ts">
import type { UsuarioPublic } from '~/types'

definePageMeta({
  layout: 'admin',
})

const { data: usuarios, refresh } = useAdminUsuarios()
const { data: currentUser } = useFetch<UsuarioPublic>('/api/auth/me', { server: false })
const toast = useToast()

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingUsuario = ref<UsuarioPublic | null>(null)
const usuarioToDelete = ref<UsuarioPublic | null>(null)
const loading = ref(false)

function initials(u: UsuarioPublic) {
  return (u.nombre?.[0] ?? '') + (u.apellido?.[0] ?? '')
}

function isSelf(u: UsuarioPublic) {
  return currentUser.value?.id_usuario === u.id_usuario
}

function openCreate() {
  editingUsuario.value = null
  showFormModal.value = true
}

function openEdit(u: UsuarioPublic) {
  editingUsuario.value = u
  showFormModal.value = true
}

function openDelete(u: UsuarioPublic) {
  usuarioToDelete.value = u
  showDeleteModal.value = true
}

async function handleToggleActivo(u: UsuarioPublic) {
  try {
    await updateAdminUsuario(u.id_usuario, { activo: !u.activo })
    toast.add({
      title: u.activo ? `${u.nombre} desactivado` : `${u.nombre} activado`,
      color: 'success',
    })
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo cambiar el estado'),
      color: 'error',
    })
  }
}

async function handleFormSubmit(data: Record<string, unknown>) {
  loading.value = true
  try {
    if (editingUsuario.value) {
      await updateAdminUsuario(editingUsuario.value.id_usuario, data)
      toast.add({ title: 'Usuario actualizado', color: 'success' })
    } else {
      await createAdminUsuario(data)
      toast.add({ title: 'Usuario creado', color: 'success' })
    }
    showFormModal.value = false
    editingUsuario.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo guardar el usuario'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!usuarioToDelete.value) return
  loading.value = true
  try {
    await deleteAdminUsuario(usuarioToDelete.value.id_usuario)
    toast.add({ title: 'Usuario eliminado', color: 'success' })
    showDeleteModal.value = false
    usuarioToDelete.value = null
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: getApiErrorMessage(e, 'No se pudo eliminar el usuario'),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="roster-fade-in flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl tracking-wider uppercase text-text-heading">
        Usuarios
      </h1>
      <UButton v-if="currentUser?.rol=== 'ADMIN'"
        label="Crear usuario"
        icon="i-lucide-user-plus"
        class="font-display uppercase tracking-wider"
        @click="openCreate"
      />
    </div>

    <!-- Roster -->
    <div v-if="usuarios?.length" class="flex flex-col rounded-lg border border-border-subtle bg-bg-surface">
      <div
        v-for="u in usuarios"
        :key="u.id_usuario"
        class="flex items-center gap-4 border-b border-border-subtle/50 px-5 py-4 last:border-b-0"
      >
        <!-- Avatar iniciales -->
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm tracking-wider uppercase"
          :class="u.rol === 'ADMIN'
            ? 'bg-brand-gold/15 text-brand-gold'
            : 'bg-bg-surface-alt text-text-muted'"
        >
          {{ initials(u) }}
        </div>

        <!-- Nombre + correo -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="font-display text-base tracking-wider uppercase text-text-heading truncate">
              {{ u.nombre }} {{ u.apellido }}
            </p>
            <span
              v-if="isSelf(u)"
              class="inline-flex shrink-0 items-center rounded bg-brand-gold/15 px-2 py-0.5 font-display text-[10px] tracking-widest uppercase text-brand-gold"
            >
              Tú
            </span>
          </div>
          <p class="text-sm text-text-muted truncate">
            {{ u.correo }}
          </p>
        </div>

        <!-- Rol badge -->
        <span
          class="hidden shrink-0 items-center gap-1.5 rounded px-2.5 py-1 font-display text-xs tracking-wider sm:inline-flex"
          :class="u.rol === 'ADMIN'
            ? 'bg-brand-gold/15 text-brand-gold'
            : 'bg-text-muted/15 text-text-muted'"
        >
          <span v-if="u.rol === 'ADMIN'" class="text-sm leading-none">★</span>
          {{ u.rol }}
        </span>

        <!-- Activo toggle -->
        <USwitch
          :model-value="u.activo"
          :disabled="isSelf(u)"
          :title="isSelf(u) ? 'No puedes desactivar tu propia cuenta' : ''"
          @update:model-value="handleToggleActivo(u)"
        />

        <!-- Acciones -->
        <UDropdownMenu
          :items="[
            {
              label: 'Editar',
              icon: 'i-lucide-pencil',
              onSelect: () => openEdit(u),
            },
            {
              label: 'Eliminar',
              icon: 'i-lucide-trash-2',
              color: 'error' as const,
              disabled: isSelf(u),
              onSelect: () => openDelete(u),
            },
          ]"
          :content="{ align: 'end' }"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            aria-label="Acciones"
          />
        </UDropdownMenu>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="usuarios?.length===0" class="py-16 text-center">
      <p class="font-display text-lg tracking-wider text-text-muted uppercase">
        Aún no hay usuarios
      </p>
      <p class="mt-2 text-sm text-text-muted/60">
        Crea el primer usuario del panel de administración.
      </p>
      <UButton
        label="Crear usuario"
        icon="i-lucide-user-plus"
        variant="outline"
        class="mt-4 font-display uppercase tracking-wider"
        @click="openCreate"
      />
    </div>
    <div v-else class="py-16 text-center">
      <p class="font-display text-lg tracking-wider text-text-muted uppercase">
        Acceso permitido a administradores.
      </p>
      <p class="mt-2 text-sm text-text-muted/60">
        No puedes editar esta sección.
      </p>
      </div>

    <!-- Modal crear/editar -->
    <UModal
      v-model:open="showFormModal"
      :title="editingUsuario ? 'Editar usuario' : 'Crear usuario'"
      :ui="{ content: 'max-w-lg w-full max-h-[90vh] overflow-y-auto' }"
    >
      <template #content>
        <AdminUserForm
          :usuario="editingUsuario"
          :loading="loading"
          @submit="handleFormSubmit"
        />
      </template>
    </UModal>

    <!-- Modal eliminar -->
    <AdminDeleteConfirmModal
      :open="showDeleteModal"
      :title="'Eliminar usuario'"
      :description="usuarioToDelete ? `Se eliminará la cuenta de ${usuarioToDelete.nombre} ${usuarioToDelete.apellido}. Esta acción no se puede deshacer.` : ''"
      @update:open="showDeleteModal = $event"
      @confirm="handleDelete"
    />
  </div>
</template>

<style scoped>
.roster-fade-in {
  animation: roster-enter 0.5s ease-out both;
}

@keyframes roster-enter {
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
  .roster-fade-in {
    animation: none;
  }
}
</style>
