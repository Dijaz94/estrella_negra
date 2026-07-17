<script setup lang="ts">
import type { EventoPublic } from '~/types'
import { z } from 'zod'

const props = defineProps<{
  evento?: EventoPublic | null
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: z.infer<typeof schema>]
}>()

const schema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio').max(100),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
  fecha_hora: z.string().min(1, 'La hora es obligatoria'),
  capacidad_max: z.number().min(1, 'Mínimo 1 persona'),
  estado: z.enum(['PROGRAMADO', 'CANCELADO', 'FINALIZADO']),
  artistas: z.string().nullish(),
  fecha_fin: z.string().nullish(),
  afiche_url: z.string().nullish(),
})

const isEditing = computed(() => !!props.evento)

const form = reactive({
  titulo: props.evento?.titulo ?? '',
  descripcion: props.evento?.descripcion ?? '',
  fecha_inicio: props.evento?.fecha_inicio ?? '',
  fecha_hora: props.evento?.fecha_hora ?? '',
  capacidad_max: props.evento?.capacidad_max ?? 50,
  estado: (props.evento?.estado ?? 'PROGRAMADO') as 'PROGRAMADO' | 'CANCELADO' | 'FINALIZADO',
  artistas: props.evento?.artistas ?? undefined,
  fecha_fin: props.evento?.fecha_fin ?? undefined,
  afiche_url: props.evento?.afiche_url ?? undefined,
})

const estadoOptions = [
  { label: 'Programado', value: 'PROGRAMADO' },
  { label: 'Cancelado', value: 'CANCELADO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
]

const pendingFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const submitting = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement>()

const displayImage = computed(() => {
  if (previewUrl.value) return previewUrl.value
  if (form.afiche_url) return form.afiche_url
  return null
})

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
  form.afiche_url = undefined
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
      formData.append('folder', 'eventos')

      const { url } = await $fetch<{ url: string }>('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      form.afiche_url = url
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = null
      pendingFile.value = null
    }

    emit('submit', { ...form })
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
      {{ isEditing ? 'Editar evento' : 'Crear evento' }}
    </h2>

    <UForm :schema="schema" :state="form" class="flex flex-col gap-5" @submit="handleSubmit">
      <!-- Información básica -->
      <UFormField label="Título" name="titulo">
        <UInput v-model="form.titulo" placeholder="Nombre del evento" class="w-full" />
      </UFormField>

      <UFormField label="Descripción" name="descripcion">
        <UTextarea v-model="form.descripcion" placeholder="Describe el evento" class="w-full" />
      </UFormField>

      <UFormField label="Artistas" name="artistas">
        <UInput v-model="form.artistas" placeholder="Artistas que participan (opcional)" class="w-full" />
      </UFormField>

      <!-- Separador -->
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <!-- Fecha y capacidad -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Fecha inicio" name="fecha_inicio">
          <UInput v-model="form.fecha_inicio" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Hora" name="fecha_hora">
          <UInput v-model="form.fecha_hora" type="time" class="w-full" />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Fecha fin (opcional)" name="fecha_fin">
          <UInput v-model="form.fecha_fin" type="date" class="w-full" />
        </UFormField>

        <UFormField label="Capacidad máxima" name="capacidad_max">
          <UInput v-model.number="form.capacidad_max" type="number" min="1" class="w-full" />
        </UFormField>
      </div>

      <!-- Separador -->
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="h-px flex-1 bg-border-subtle" />
        <span class="text-brand-gold/40 text-sm leading-none">☆</span>
        <span class="h-px flex-1 bg-border-subtle" />
      </div>

      <!-- Publicación -->
      <UFormField label="Estado" name="estado">
        <USelect v-model="form.estado" :items="estadoOptions" class="w-full" />
      </UFormField>

      <!-- Afiche -->
      <UFormField label="Afiche del evento" name="afiche_url">
        <div v-if="displayImage" class="relative">
          <img
            :src="displayImage"
            alt="Preview del afiche"
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
        :label="isEditing ? 'Guardar cambios' : 'Crear evento'"
        :loading="loading || submitting"
        :disabled="loading || submitting"
        class="mt-2 justify-center font-display uppercase tracking-wider"
      />
    </UForm>
  </div>
</template>
