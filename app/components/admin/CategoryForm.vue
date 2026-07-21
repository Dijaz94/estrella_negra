<script setup lang="ts">
import type { CategoryItem } from '~/types'
import { z } from 'zod'

const props = defineProps<{
  categoria?: CategoryItem | null
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: z.infer<typeof schema>]
}>()

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  orden: z.number().min(0, 'Mínimo 0'),
})

const isEditing = computed(() => !!props.categoria)

const form = reactive({
  nombre: props.categoria?.nombre ?? '',
  orden: props.categoria?.orden ?? 0,
})
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h2 class="font-display text-xl uppercase tracking-widest text-text-heading">
      {{ isEditing ? 'Editar categoría' : 'Crear categoría' }}
    </h2>

    <UForm :schema="schema" :state="form" class="flex flex-col gap-5" @submit="emit('submit', { ...form })">
      <UFormField label="Nombre" name="nombre">
        <UInput v-model="form.nombre" placeholder="Nombre de la categoría" class="w-full" />
      </UFormField>

      <UFormField label="Orden" name="orden">
        <UInput v-model.number="form.orden" type="number" min="0" class="w-full" />
      </UFormField>

      <UButton
        type="submit"
        :label="isEditing ? 'Guardar cambios' : 'Crear categoría'"
        :loading="loading"
        :disabled="loading"
        class="mt-2 justify-center font-display uppercase tracking-wider"
      />
    </UForm>
  </div>
</template>
