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
    '@pinia/nuxt'
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

  css: ['./app/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  compatibilityDate: '2025-07-15',

  nitro: {
    preset: 'bun'
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
