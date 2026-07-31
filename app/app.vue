<script setup>
const errors = ref([])
const route = useRoute()
let reported = false

function addError(source, e) {
  const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e)
  const line = `[${new Date().toLocaleTimeString()}] ${route.path} | ${source} | ${msg}`.slice(0, 400)
  errors.value.push(line)
  if (errors.value.length > 15) errors.value.shift()
  reportToEmail(line)
}

async function reportToEmail(msg) {
  if (reported) return
  reported = true
  try {
    await $fetch('/api/feedback', {
      method: 'POST',
      body: { nombre: 'Debug App', email: 'debug@estrella.negra', mensaje: msg },
    })
  } catch { /* silencioso */ }
}

onErrorCaptured((err, _instance, info) => {
  addError(`vue:${info}`, err)
  return false
})

onMounted(() => {
  window.onerror = (msg, src, line, col, err) => {
    addError(`window:${src}:${line}:${col}`, err ?? msg)
    return false
  }
  window.onunhandledrejection = (e) => addError('promise', e.reason)
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UToast/>

    <!-- DEBUG PANEL -->
    <div
      v-if="errors.length"
      class="fixed bottom-0 left-0 right-0 z-[9999] max-h-52 overflow-auto bg-red-950/95 p-3 font-mono text-[10px] leading-snug text-white whitespace-pre-wrap"
    >
      <p class="font-bold text-red-300">ERROR CAPTURADO ({{ errors.length }}) — ruta: {{ route.path }}</p>
      <div
        v-for="(err, i) in errors"
        :key="i"
        class="border-t border-red-800/60 py-1"
      >{{ err }}</div>
      <button
        @click="errors = []"
        class="mt-1 rounded bg-red-800/60 px-2 py-0.5 text-[9px] text-red-200 hover:bg-red-700/60"
      >Limpiar</button>
    </div>
  </UApp>
</template>
