// app.config.ts
// app.config.ts
export default defineAppConfig({
  ui: {
    tailwindMerge: {
      extend: {
        theme: {
          color: [
            'bg-base', 'bg-surface', 'bg-surface-alt',
            'text-heading', 'text-body', 'text-muted',
            'brand-gold', 'brand-gold-hover', 'brand-gold-soft',
            'label-bg', 'label-bg-dark',
            'cta', 'cta-hover', 'cta-soft',
            'border-subtle', 'border-strong',
          ],
        },
      },
    },

    input: {
      slots: {
        base: 'bg-bg-base border-border-subtle text-text-body placeholder:text-text-muted focus:border-brand-gold focus:ring-brand-gold/50',
      },
    },
    button: {
      slots: {
        base: 'font-semibold font-body',
      },
    },
    formField: {
      slots: {
        label: 'text-text-muted text-sm font-body',
        error: 'text-cta text-sm',
      },
    },
  },
})