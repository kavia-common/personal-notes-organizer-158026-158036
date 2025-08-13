/**
 * Nuxt configuration for Notes Frontend.
 * Uses runtimeConfig.public.apiBase as the backend API root.
 * Load it via NUXT_PUBLIC_API_BASE_URL in environment.
 */
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Runtime config (do not hardcode backend URL)
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
      appName: 'Notes',
    },
  },

  // Global styles
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Personal Notes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'A modern minimal notes app with tags and categories' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },

  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
