<script setup lang="ts">
import type { CategoryItem } from '~/types'
import { z } from 'zod'

const props = defineProps<{
  producto?: {
    id_producto: number
    nombre: string
    descripcion: string
    precio: number
    imagen_url: string | null
    disponible: boolean
    destacado: boolean
    id_categoria: number
  } | null
  categorias: CategoryItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: Record<string, unknown>]
}>()

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  precio: z.number().min(1, 'Debe ser mayor que 0'),
  id_categoria: z.number().min(1, 'Selecciona una categoría'),
  imagen_url: z.string().nullable(),
  disponible: z.boolean(),
  destacado: z.boolean(),
})

const isEditing = computed(() => !!props.producto)

const form = reactive({
  nombre: props.producto?.nombre ?? '',
  descripcion: props.producto?.descripcion ?? '',
  precio: props.producto?.precio ?? 0,
  id_categoria: props.producto?.id_categoria ?? props.categorias[0]?.id_categoria ?? 0,
  imagen_url: props.producto?.imagen_url ?? null,
  disponible: props.producto?.disponible ?? true,
  destacado: props.producto?.destacado ?? false,
})

const pendingFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const submitting = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()

const displayImage = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (form.imagen_url) return form.imagen_url
  return null
})

const categoriaOptions = computed(() =>
  props.categorias.map(c => ({ label: c.nombre, value: c.id_categoria }))
)

function handleFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)

  pendingFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  uploadError.value = ''
}

function removeImage() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  pendingFile.value = null
  form.imagen_url = null
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleSubmit() {
  submitting.value = true
  uploadError.value = ''

  try {
    if (pendingFile.value) {
      const formData = new FormData()
      formData.append('file', pendingFile.value)
      formData.append('folder', 'productos')

      const { url } = await $fetch<{ url: string }>('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      form.imagen_url = url
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      pendingFile.value = null
    }

    emit('submit', { ...form })
    submitting.value = false
  } catch (e: any) {
    uploadError.value = e?.data?.message ?? 'Error al subir la imagen'
    submitting.value = false
  }
}

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h2 class="font-display text-xl uppercase tracking-widest text-text-heading">
      {{ isEditing ? 'Editar producto' : 'Crear producto' }}
    </h2>

    <UForm :schema="schema" :state="form" class="flex flex-col gap-5" @submit="handleSubmit">
      <UFormField label="Nombre" name="nombre">
        <UInput v-model="form.nombre" placeholder="Nombre del producto" class="w-full" />
      </UFormField>

      <UFormField label="Descripción" name="descripcion">
        <UTextarea v-model="form.descripcion" placeholder="Describe el producto" class="w-full" />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Precio" name="precio">
          <UInput v-model.number="form.precio" type="number" min="0" class="w-full" />
        </UFormField>

        <UFormField label="Categoría" name="id_categoria">
          <USelect v-model="form.id_categoria" :items="categoriaOptions" class="w-full" />
        </UFormField>
      </div>

      <!-- Separador -->
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <!-- Toggles -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Disponible" name="disponible">
          <USwitch v-model="form.disponible" />
        </UFormField>

        <UFormField label="Destacado" name="destacado">
          <USwitch v-model="form.destacado" />
        </UFormField>
      </div>

      <!-- Separador -->
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <!-- Imagen -->
      <UFormField label="Imagen del producto" name="imagen_url">
        <div v-if="displayImage" class="relative">
          <img
            :src="displayImage"
            alt="Preview del producto"
            class="max-h-48 w-full rounded-lg object-cover border border-border-subtle"
          />
          <div class="mt-2 flex items-center gap-2">
            <UButton
              label="Quitar"
              color="error"
              variant="outline"
              size="xs"
              @click="removeImage"
            />
          </div>
        </div>

        <div v-else class="flex flex-col gap-3">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="handleFileSelect"
          />
          <UButton
            label="Seleccionar imagen"
            variant="outline"
            icon="i-lucide-upload"
            @click="triggerFileInput"
          />
          <p class="text-xs text-text-muted/60">Formatos: jpg, png, webp. Máximo 5 MB.</p>
          <p v-if="uploadError" class="text-xs text-cta">{{ uploadError }}</p>
        </div>
      </UFormField>

      <!-- Botón submit -->
      <UButton
        type="submit"
        :label="isEditing ? 'Guardar cambios' : 'Crear producto'"
        :loading="loading || submitting"
        :disabled="loading || submitting"
        class="mt-2 justify-center font-display uppercase tracking-wider"
      />
    </UForm>
  </div>
</template>
