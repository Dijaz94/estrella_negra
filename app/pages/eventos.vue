<script setup lang="ts">
  const {data:eventos,pending, error }= useEvents()
</script>

<template>
  <div class="space-y-8">
    <h1 class="font-display text-3xl tracking-wider uppercase text-text-heading">
      Eventos
    </h1>
    

    <!-- card section -->
     <div class="max-w-7xl">
      <CardEventos v-for="evento in eventos" :evento="evento"/>

     </div>
  </div>
</template>
