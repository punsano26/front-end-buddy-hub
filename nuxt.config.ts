import tailwindcss from '@tailwindcss/vite'

const siteUrl = import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:5000'
const normalizedSiteUrl = siteUrl.replace(/\/$/, '')

// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line nuxt/nuxt-config-keys-order
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/hints',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'dayjs-nuxt'
  ],

  sourcemap: {
    client: false,
    server: false
  },

  components: {
    dirs: [
      {
        path: '~/volt',
        global: false,
        pathPrefix: false
      },
      '~/components'
    ]
  },

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'th'
      },
      title: 'หาเพื่อนคุยออนไลน์',
      titleTemplate: '%s | Buddy Hub',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content' },
        {
          name: 'description',
          content: 'Buddy Hub เว็บหาเพื่อนคุยออนไลน์ เริ่มคุยกับคนใหม่ได้ทันทีในบรรยากาศที่เป็นมิตรและปลอดภัย'
        },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Buddy Hub' },
        { property: 'og:locale', content: 'th_TH' },
        { property: 'og:title', content: 'Buddy Hub | หาเพื่อนคุยออนไลน์' },
        {
          property: 'og:description',
          content: 'หาเพื่อนคุยใหม่ได้ง่ายๆ ผ่านห้องแชทออนไลน์ของ Buddy Hub'
        },
        { property: 'og:url', content: normalizedSiteUrl },
        { property: 'og:image', content: `${normalizedSiteUrl}/png/logo-buddy-hub.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Buddy Hub | หาเพื่อนคุยออนไลน์' },
        {
          name: 'twitter:description',
          content: 'ค้นหาเพื่อนคุยใหม่ พูดคุยทันใจ และสร้างคอนเนกชันดีๆ ได้ทุกวัน'
        },
        { name: 'twitter:image', content: `${normalizedSiteUrl}/png/logo-buddy-hub.png` }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/png/logo-buddy-hub.png' },
        { rel: 'canonical', href: normalizedSiteUrl }
      ]
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: normalizedSiteUrl,
      siteName: 'Buddy Hub',
      defaultOgImage: '/png/logo-buddy-hub.png'
    }
  },

  routeRules: {
    '/auth': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    },
    '/auth/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    },
    '/public/chat/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    },
    '/public/friends/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    },
    '/public/profile/**': {
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    },
    '/sitemap.xml': {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
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
    ],
    optimizeDeps: {
      include: [
        'primevue/config',
        'primevue/confirmationservice',
        'primevue/toastservice',
        'primevue/styleclass',
        'primevue/animateonscroll',
        'primevue/usetoast',
        'primevue/avatar',
        'primevue/badge',
        'primevue/button',
        'primevue/buttongroup',
        'primevue/card',
        'primevue/checkbox',
        'primevue/datepicker',
        'primevue/dialog',
        'primevue/divider',
        'primevue/inputnumber',
        'primevue/inputtext',
        'primevue/menu',
        'primevue/message',
        'primevue/paginator',
        'primevue/password',
        'primevue/popover',
        'primevue/progressbar',
        'primevue/progressspinner',
        'primevue/select',
        'primevue/selectbutton',
        'primevue/skeleton',
        'primevue/step',
        'primevue/stepitem',
        'primevue/steplist',
        'primevue/steppanel',
        'primevue/steppanels',
        'primevue/stepper',
        'primevue/tag',
        'primevue/textarea',
        'primevue/toast',
        'primevue/toggleswitch',
        'primevue/toolbar',
        '@primevue/icons/angledoubleleft',
        '@primevue/icons/angledoubleright',
        '@primevue/icons/angledown',
        '@primevue/icons/angleleft',
        '@primevue/icons/angleright',
        '@primevue/icons/angleup',
        '@primevue/icons/calendar',
        '@primevue/icons/check',
        '@primevue/icons/chevrondown',
        '@primevue/icons/chevronleft',
        '@primevue/icons/chevronright',
        '@primevue/icons/chevronup',
        '@primevue/icons/eye',
        '@primevue/icons/eyeslash',
        '@primevue/icons/minus',
        '@primevue/icons/search',
        '@primevue/icons/spinner',
        '@primevue/icons/times',
        '@primevue/icons/windowmaximize',
        '@primevue/icons/windowminimize',
        'tailwind-merge',
        'axios',
        'socket.io-client',
        'chart.js',
        'humps'
      ]
    },
    build: {
      sourcemap: false
    }
  },
  dayjs: {
    locales: ['en', 'th'],
    plugins: ['relativeTime', 'utc', 'timezone', 'buddhistEra'],
    defaultLocale: 'th',
    defaultTimezone: 'Asia/Bangkok'
  }
})
