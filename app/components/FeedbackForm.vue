<script setup lang="ts">
import type { Feedback } from '~/types/index';
import {z} from 'zod'

const props = defineProps<{
    feedback: Feedback
    loading?: boolean
}>()

const send = defineEmits<{'submit': [data: { nombre: string; email: string; mensaje: string }]}>()

const schema = z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    mensaje: z.string().min(1)
})

</script>

<template>

    <div class=" flex flex-col gap-4 bg-bg-surface border-2 border-brand-gold-soft max-w-xl rounded-2xl mx-auto p-12 hover:border-brand-gold-hover ">
        <h2 class="font-display text-3xl uppercase text-text-heading text-center">Nos interesa tu opinión</h2>
        <p class="font-body text-text-muted text-sm text-center mb-4">Por favor, cuéntanos como fue tu experiencia el Estrella Negra</p>
        <UForm class="flex flex-col gap-6" @submit.prevent="send('submit', feedback)" :state="feedback" :schema="schema">
        <UFormField label="Nombre" name="nombre">
            <UInput class=" w-full" v-model="feedback.nombre"/>
        </UFormField>
        <UFormField label="Correo" name="email">
            <UInput class=" w-full" v-model="feedback.email" />
        </UFormField>
        <UFormField label="Escribe aquí tu experiencia en el local" name="mensaje">
            <UTextarea class="h-full w-full" v-model="feedback.mensaje" />
        </UFormField>

        <UButton type="submit" class="uppercase font-display flex justify-center" :loading="loading" :disabled="loading">
            Presiona para enviar feedback
        </UButton>
        </UForm>
    </div>
    

</template>
