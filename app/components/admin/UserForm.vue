<script setup lang="ts">
import type { UsuarioPublic } from '~/types'
import { z } from 'zod'

const props = defineProps<{
  usuario?: UsuarioPublic | null
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()

const isEditing = computed(() => !!props.usuario)

const schema = computed(() => {
  if (isEditing.value) {
    return z.object({
      nombre: z.string().min(1, 'El nombre es obligatorio').max(50),
      apellido: z.string().min(1, 'El apellido es obligatorio').max(50),
      correo: z.string().email('Correo inválido').max(254),
      rol: z.enum(['ADMIN', 'EDITOR']),
      activo: z.boolean(),
      password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
    })
  }
  return z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(50),
    apellido: z.string().min(1, 'El apellido es obligatorio').max(50),
    correo: z.string().email('Correo inválido').max(254),
    rol: z.enum(['ADMIN', 'EDITOR']),
    activo: z.boolean(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  })
})

const form = reactive({
  nombre: props.usuario?.nombre ?? '',
  apellido: props.usuario?.apellido ?? '',
  correo: props.usuario?.correo ?? '',
  rol: (props.usuario?.rol ?? 'EDITOR') as 'ADMIN' | 'EDITOR',
  activo: props.usuario?.activo ?? true,
  password: '',
})

const rolOptions = [
  { label: 'Admin — cabeza de cartel', value: 'ADMIN' },
  { label: 'Editor — staff', value: 'EDITOR' },
]
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h2 class="font-display text-xl uppercase tracking-widest text-text-heading">
      {{ isEditing ? 'Editar usuario' : 'Crear usuario' }}
    </h2>

    <UForm :schema="schema" :state="form" class="flex flex-col gap-5" @submit="emit('submit', { ...form })">
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Nombre" name="nombre">
          <UInput v-model="form.nombre" placeholder="Nombre" class="w-full" />
        </UFormField>

        <UFormField label="Apellido" name="apellido">
          <UInput v-model="form.apellido" placeholder="Apellido" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Correo" name="correo">
        <UInput v-model="form.correo" placeholder="correo@ejemplo.com" class="w-full" />
      </UFormField>

      <UFormField label="Rol" name="rol">
        <USelect v-model="form.rol" :items="rolOptions" class="w-full" />
      </UFormField>

      <!-- Separador -->
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <UFormField label="Contraseña" name="password">
        <UInput
          v-model="form.password"
          type="password"
          :placeholder="isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'"
          class="w-full"
        />
        <p v-if="isEditing" class="mt-1 text-xs text-text-muted/60">
          Dejalo vacío si no querés cambiar la contraseña.
        </p>
      </UFormField>

      <UButton
        type="submit"
        :label="isEditing ? 'Guardar cambios' : 'Crear usuario'"
        :loading="loading"
        :disabled="loading"
        class="mt-2 justify-center font-display uppercase tracking-wider"
      />
    </UForm>
  </div>
</template>
