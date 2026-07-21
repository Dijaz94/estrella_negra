<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
  description?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <UModal
    :open="props.open"
    title="Eliminar"
    :ui="{ content: 'max-w-md w-full' }"
    @update:open="emit('update:open', $event)"
  >
    <template #content="{ close }">
      <div class="flex flex-col gap-4 p-6">
        <h2 class="font-display text-lg tracking-wider uppercase text-text-heading">
          {{ title }}
        </h2>
        <p class="font-body text-sm text-text-muted">
          {{ description ?? 'Esta acción no se puede deshacer.' }}
        </p>
        <div class="flex justify-end gap-3">
          <UButton label="Cancelar" variant="outline" @click="close" />
          <UButton label="Eliminar" color="error" @click="emit('confirm')" />
        </div>
      </div>
    </template>
  </UModal>
</template>
