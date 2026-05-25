// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  components: true,

  typescript: {
    strict: true
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001'
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

  tailwindcss: {
    config: {
      content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './app.vue',
        './composables/**/*.{js,ts}',
        './utils/**/*.{js,ts}',
      ]
    }
  },

  vite: {
    server: {
      watch: {
        ignored: ['**/.nuxt/**', '**/node_modules/**']
      }
    }
  },

  compatibilityDate: '2025-01-06'
})