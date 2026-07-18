<script setup lang="ts">
import {z} from 'zod'

definePageMeta({
  layout:false,
})

const schema = z.object({
  email: z.email({message:'Ingrese un correo válido'}),
  password: z.string({message:'Ingrese contraseña'})
  
})


const error = ref('')
const loading = ref(false)

const login = reactive({
  email: '',
  password: ''
})

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: { correo: login?.email, password: login?.password },
      credentials: 'include'
    })
    await navigateTo('/admin/dashboard')
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-linear-to-br to-bg-base from-label-bg  p-4 w-full mx-auto ">
    <div class="max-w-lg w-full">
      <div class="rounded-lg border border-border-subtle bg-bg-surface p-12 hero-fade-in">
        <h1 class="font-display mb-8 text-center text-2xl tracking-widest uppercase text-text-heading">
          Admin
        </h1>
        <UForm @submit="handleSubmit" class="flex flex-col gap-4" v-model="login" :state="login" :schema="schema">
          <UFormField label="Correo" name="email" class="min-h-22">
            <UInput v-model="login.email" class="w-full" placeholder="correo@ejemplo.com" />
            
          </UFormField>
          <UFormField label="Contraseña" name="password" class="min-h-22">
            <UInput v-model="login.password" class="w-full " type="password" placeholder="••••••••"/>
          </UFormField>
                    <p v-if="error" class="text-sm text-cta">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="mt-2 rounded bg-brand-gold px-4 py-2 font-semibold text-bg-base transition-colors hover:bg-brand-gold-hover disabled:opacity-50"
          >
            {{ loading ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </UForm>

        
      </div>
    </div>
  </div>
</template>


<style scoped>
.hero-fade-in {
  animation: hero-enter 0.6s ease-out both;
}

@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>