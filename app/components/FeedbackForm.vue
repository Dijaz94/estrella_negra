<script setup lang="ts">
import type { Feedback } from '~/types/index';
import {z} from 'zod'

const props = defineProps<{
    feedback: Feedback
    loading?: boolean
}>()

const send = defineEmits<{ 'submit': [data: { nombre: string; email: string; mensaje: string; recaptchaToken: string }] }>()

const schema = z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    mensaje: z.string().min(1)
})

const recaptchaError = ref('')

const { proxy } = useScriptGoogleRecaptcha()

async function handleSubmit() {
    recaptchaError.value = ''
    try {
        const token = await proxy.grecaptcha.execute('6Ld1x3ItAAAAAAzkwBB_sANdC_uNoI8qzApk21i8', { action: 'feedback' }) as unknown as string
        send('submit', { ...props.feedback, recaptchaToken: token })
    } catch {
        recaptchaError.value = 'Error de verificación. Por favor, recarga la página e intenta de nuevo.'
    }
}

</script>

<template>

    <div class=" flex flex-col gap-4 bg-bg-surface border-2 border-brand-gold-soft max-w-xl rounded-2xl mx-auto p-12 hover:border-brand-gold-hover ">
        <h2 class="font-display text-3xl uppercase text-text-heading text-center">Nos interesa tu opinión</h2>
        <p class="font-body text-text-muted text-sm text-center mb-4">Por favor, cuéntanos como fue tu experiencia el Estrella Negra</p>
        <UForm class="flex flex-col gap-6" @submit.prevent="handleSubmit" :state="feedback" :schema="schema">
        <UFormField label="Nombre" name="nombre">
            <UInput class=" w-full" v-model="feedback.nombre"/>
        </UFormField>
        <UFormField label="Correo" name="email">
            <UInput class=" w-full" v-model="feedback.email" />
        </UFormField>
        <UFormField label="Escribe aquí tu experiencia en el local" name="mensaje">
            <UTextarea class="h-full w-full" v-model="feedback.mensaje" />
        </UFormField>

        <p v-if="recaptchaError" class="text-sm text-red-400">{{ recaptchaError }}</p>

        <UButton type="submit" class="uppercase font-display flex justify-center" :loading="loading" :disabled="loading">
            Presiona para enviar feedback
        </UButton>
        </UForm>
        <p class="text-xs text-text-muted text-center">
            Este sitio está protegido por reCAPTCHA y se aplican la
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="underline hover:text-brand-gold">Política de Privacidad</a>
            y los
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" class="underline hover:text-brand-gold">Términos de Servicio</a>
            de Google.
        </p>
    </div>
    

</template>
