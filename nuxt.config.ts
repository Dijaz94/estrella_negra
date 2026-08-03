export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],


  future: {
    compatibilityVersion: 4,
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      siteUrl: '',
      businessWhatsApp: '',
    },
    supabaseServiceKey: '',
    feedbackEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
  },

  nitro: {
    imports: {
      dirs: ['server/services', 'server/utils'],
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
  },
  app: {
    head: {
      title: 'Estrella Negra',
      titleTemplate: '%s · Bar de Jazz en Valparaíso',
    },
  },

})

