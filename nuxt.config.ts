export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/scripts'],
  css: ['~/assets/css/main.css'],


  future: {
    compatibilityVersion: 4,
  },

  scripts: {
    registry: {
      googleRecaptcha: {
        siteKey: '6Ld1x3ItAAAAAAzkwBB_sANdC_uNoI8qzApk21i8',
        trigger: 'onNuxtReady',
      },
    },
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
    recaptchaSecretKey: '',
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

