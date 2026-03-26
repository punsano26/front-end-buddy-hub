import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils',
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt'
  ],

  components: {
    dirs: [
      {
        path: '~/volt',
        global: true
      },
      '~/components'
    ]
  },

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Buddy Hub Hub',
      link: [
        { rel: 'icon', type: 'image/png', href: '/png/logo-buddy-hub.png' }
      ]
    }
  },

  css: ['./app/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 5000
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'bun'
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  dayjs: {
    locales: ['en', 'th'],
    plugins: ['relativeTime', 'utc', 'timezone', 'buddhistEra'],
    defaultLocale: 'th',
    defaultTimezone: 'Asia/Bangkok'
  }
})
