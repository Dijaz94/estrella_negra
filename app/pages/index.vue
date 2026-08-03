<script setup lang="ts">
import FeedbackForm from '~/components/FeedbackForm.vue';

const { data: business } = useBusiness()


const feedback = reactive({
  nombre:'',
  email:'',
  mensaje:''
})

function limpiarFeedback(){
  feedback.nombre=''
  feedback.email=''
  feedback.mensaje=''
}
const enviandoFeedback = ref(false)
const errorFeedback = ref(false)
const mensajeError = ref('')
const toast = useToast()

async function handleFeedback(data: { nombre: string; email: string; mensaje: string }){
  enviandoFeedback.value=true
  try{
    const emailEnviado = data.email
      await useFeedback(data)
      limpiarFeedback()
      toast.add({
        title:'Correo enviado exitosamente.',
        description:`El correo de ${emailEnviado} se envió con éxito`
      })
  }
  catch(e:any){
    errorFeedback.value=true
    mensajeError.value= getApiErrorMessage(e, "No se pudo enviar el formulario de Feedback")

    toast.add({
        title:'Algo salió mal',
        description:mensajeError.value
      })
  }
  finally{
    enviandoFeedback.value = false
  }
}
</script>

<template>
  <div v-if="business" class="space-y-16 pb-16 md:space-y-24 md:pb-24">
    <HeroSection :business="business" />
    <MenuCta />
    <BusinessInfo :business="business" />



    <SocialLinks v-if="business.redes?.length" :redes="business.redes" />
  </div>


  <div v-else class="flex min-h-[50dvh] items-center justify-center">
    <p class="text-sm text-text-muted">Cargando...</p>
  </div>

  <FeedbackForm :feedback="feedback" :loading="enviandoFeedback" @submit="handleFeedback"/>
</template>
