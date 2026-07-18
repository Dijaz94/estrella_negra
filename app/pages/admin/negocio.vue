<script setup lang="ts">
import type { BusinessInfo, DiaHorario } from '~/types'
import { z } from 'zod'

definePageMeta({
  layout: 'admin',
})

const toast = useToast()

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
  '23:00', '23:30',
]

const { data: negocio, refresh } = useFetch<BusinessInfo>('/api/admin/negocio')

const loading = ref(false)
const logoInput = ref<HTMLInputElement>()
const bannerInput = ref<HTMLInputElement>()

const schema = z.object({
  nombre_local: z.string().min(1, 'El nombre es obligatorio').max(50),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  direccion: z.string().min(1, 'La dirección es obligatoria').max(50),
  telefono: z.string().max(20).optional(),
  whatsapp: z.string().max(20).optional(),
  correo: z.string().email('Email no válido').max(254),
  logo_url: z.string().nullable().optional(),
  banner_url: z.string().nullable().optional(),
})

const form = reactive({
  nombre_local: '',
  descripcion: '',
  direccion: '',
  telefono: '',
  whatsapp: '',
  correo: '',
  logo_url: null as string | null,
  banner_url: null as string | null,
})

const horario = ref<DiaHorario[]>([])

watch(negocio, (val) => {
  if (!val) return
  form.nombre_local = val.nombre_local
  form.descripcion = val.descripcion
  form.direccion = val.direccion
  form.telefono = val.telefono
  form.whatsapp = val.whatsapp
  form.correo = val.correo
  form.logo_url = val.logo_url || null
  form.banner_url = val.banner_url || null
  horario.value = val.horario.map(d => ({ ...d }))
}, { immediate: true })

const logoPreview = computed(() => form.logo_url)
const bannerPreview = computed(() => form.banner_url)

async function handleFileSelect(event: Event, field: 'logo_url' | 'banner_url') {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'negocio')

  try {
    const { url } = await $fetch<{ url: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    form[field] = url
  } catch (e: any) {
    toast.add({ title: 'Error', description: e?.data?.message ?? 'No se pudo subir la imagen', color: 'error' })
  }
}

function toggleDia(dia: DiaHorario) {
  dia.abierto = !dia.abierto
}

async function handleSubmit() {
  loading.value = true
  try {
    await $fetch('/api/admin/negocio', {
      method: 'PUT',
      body: {
        ...form,
        horario: horario.value,
      },
    })
    toast.add({ title: 'Negocio actualizado', color: 'success' })
    await refresh()
  } catch (e: any) {
    toast.add({
      title: 'Error',
      description: e?.data?.message ?? 'No se pudo guardar',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="negocio" class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="font-display text-2xl tracking-wider uppercase text-text-heading">
        Negocio
      </h1>
      <UButton
        type="submit"
        label="Guardar cambios"
        :loading="loading"
        :disabled="loading"
        icon="i-lucide-save"
        class="font-display uppercase tracking-wider"
        form="negocio-form"
      />
    </div>

    <UForm id="negocio-form" :schema="schema" :state="form" class="flex flex-col gap-8" @submit="handleSubmit">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Columna izquierda: datos + contacto -->
        <div class="flex flex-col gap-6">
          <section class="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5">
            <h2 class="font-display text-sm uppercase tracking-widest text-text-muted">
              Datos del local
            </h2>

            <UFormField label="Nombre del local" name="nombre_local">
              <UInput v-model="form.nombre_local" placeholder="Nombre del local" class="w-full" />
            </UFormField>

            <UFormField label="Descripción" name="descripcion">
              <UTextarea v-model="form.descripcion" placeholder="Describe el negocio" class="w-full" />
            </UFormField>

            <UFormField label="Dirección" name="direccion">
              <UInput v-model="form.direccion" placeholder="Dirección del local" class="w-full" />
            </UFormField>
          </section>

          <section class="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5">
            <h2 class="font-display text-sm uppercase tracking-widest text-text-muted">
              Contacto
            </h2>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <UFormField label="Teléfono" name="telefono">
                <UInput v-model="form.telefono" placeholder="+56 9 ..." class="w-full" />
              </UFormField>

              <UFormField label="WhatsApp" name="whatsapp">
                <UInput v-model="form.whatsapp" placeholder="569..." class="w-full" />
              </UFormField>

              <UFormField label="Correo" name="correo">
                <UInput v-model="form.correo" placeholder="correo@..." class="w-full" />
              </UFormField>
            </div>
          </section>
        </div>

        <!-- Columna derecha: horario -->
        <div class="flex flex-col">
          <section class="flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-surface p-5 h-full">
            <h2 class="font-display text-sm uppercase tracking-widest text-text-muted">
              Horario semanal
            </h2>

            <div class="flex flex-col gap-2">
              <div
                v-for="dia in horario"
                :key="dia.dia"
                class="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border-subtle/50 bg-bg-base px-3 py-2.5"
              >
                <div class="flex items-center gap-3">
                  <span class="w-16 sm:w-20 shrink-0 font-display text-xs tracking-wider text-text-heading uppercase">
                    {{ dia.dia }}
                  </span>

                  <UButton
                    :label="dia.abierto ? 'Abierto' : 'Cerrado'"
                    :color="dia.abierto ? 'success' : 'error'"
                    variant="outline"
                    size="xs"
                    class="shrink-0"
                    @click="toggleDia(dia)"
                  />
                </div>

                <div v-if="dia.abierto" class="flex items-center gap-2 sm:ml-auto">
                  <USelect
                    v-model="dia.hora_apertura"
                    :items="TIME_SLOTS"
                    size="sm"
                    class="w-24 sm:w-28"
                  />
                  <span class="text-xs text-text-muted">a</span>
                  <USelect
                    v-model="dia.hora_cierre"
                    :items="TIME_SLOTS"
                    size="sm"
                    class="w-24 sm:w-28"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Imágenes: full width -->
      <section class="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-surface p-5 mb-auto">
        <h2 class="font-display text-sm uppercase tracking-widest text-text-muted">
          Imágenes
        </h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="flex flex-col gap-3">
            <span class="font-display text-xs tracking-wider text-text-heading uppercase">Logo</span>
            <input
              ref="logoInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              @change="(e) => handleFileSelect(e, 'logo_url')"
            />
            <div v-if="logoPreview" class="relative">
              <img
                :src="logoPreview"
                alt="Logo"
                class="h-60 w-auto rounded-lg object-contain border border-border-subtle"
              />
              <UButton
                label="Quitar"
                color="error"
                variant="outline"
                size="xs"
                class="mt-2"
                @click="()=>{form.logo_url = null}"
              />
            </div>
            <UButton
              v-else
              label="Subir logo"
              variant="outline"
              icon="i-lucide-upload"
              @click="logoInput?.click()"
            />
          </div>

          <div class="flex flex-col gap-3">
            <span class="font-display text-xs tracking-wider text-text-heading uppercase">Banner</span>
            <input
              ref="bannerInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              @change="(e) => handleFileSelect(e, 'banner_url')"
            />
            <div v-if="bannerPreview" class="relative">
              <img
                :src="bannerPreview"
                alt="Banner"
                class="h-60 w-full rounded-lg object-cover border border-border-subtle"
              />
              <UButton
                label="Quitar"
                color="error"
                variant="outline"
                size="xs"
                class="mt-2"
                @click="()=>{form.banner_url = null}"</UButton>
              
            </div>
            <UButton
              v-else
              label="Subir banner"
              variant="outline"
              icon="i-lucide-upload"
              @click="bannerInput?.click()"
            />
          </div>
        </div>
      </section>
    </UForm>
  </div>

  <div v-else class="py-16 text-center">
    <p class="text-text-muted">Cargando datos del negocio…</p>
  </div>
</template>
