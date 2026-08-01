<script setup lang="ts">
defineProps<{
  label: string
  value: number | string
  accent?: 'gold' | 'error' | 'muted'
}>()
</script>

<template>
  <div
    class="card-hover flex flex-col gap-1 rounded-lg border border-border-subtle bg-bg-surface px-4 py-3"
  >
    <span class="font-display text-xs tracking-widest uppercase text-text-muted">
      {{ label }}
    </span>
    <span
      class="font-display text-3xl tabular-nums tracking-wider"
      :class="
        accent === 'error'
          ? 'text-cta'
          : accent === 'muted'
            ? 'text-text-muted'
            : 'text-text-heading'
      "
    >
      {{ value }}
    </span>
  </div>
</template>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

@media (hover: hover) and (pointer: fine) {
  .card-hover:hover {
    transform: scale(1.02);
    border-color: var(--color-border-strong);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  }
}
</style>
