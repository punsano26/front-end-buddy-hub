<template>
  <NuxtLayout>
    <LoadingPopUp />
    <NuxtRouteAnnouncer />
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import LoadingPopUp from '~/components/loading/LoadingPopUp.vue'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const siteUrl = String(runtimeConfig.public.siteUrl || 'http://localhost:5000').replace(/\/$/, '')
const defaultOgImage = String(runtimeConfig.public.defaultOgImage || '/png/logo-buddy-hub.png')
const siteName = String(runtimeConfig.public.siteName || 'Buddy Hub')

const canonicalUrl = computed((): string => {
  const normalizedPath = route.path === '/' ? '' : route.path.replace(/\/$/, '')
  return `${siteUrl}${normalizedPath}`
})

const ogImageUrl = computed((): string => {
  if (defaultOgImage.startsWith('http')) {
    return defaultOgImage
  }

  return `${siteUrl}${defaultOgImage}`
})

useHead((): any => ({
  link: [
    {
      key: 'canonical',
      rel: 'canonical',
      href: canonicalUrl.value
    }
  ]
}))

useSeoMeta({
  ogSiteName: siteName,
  ogUrl: (): string => canonicalUrl.value,
  ogImage: (): string => ogImageUrl.value,
  twitterImage: (): string => ogImageUrl.value
})

const updateAppHeight = (): void => {
  if (typeof window === 'undefined') return
  const viewport = window.visualViewport
  const height = viewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${height}px`)

  const keyboardOpen = viewport
    ? window.innerHeight - viewport.height > 120
    : false
  document.documentElement.classList.toggle('keyboard-open', keyboardOpen)

  if (keyboardOpen) {
    window.scrollTo(0, 0)
  }
}

onMounted((): void => {
  updateAppHeight()
  window.addEventListener('resize', updateAppHeight)
  window.visualViewport?.addEventListener('resize', updateAppHeight)
})

onUnmounted((): void => {
  window.removeEventListener('resize', updateAppHeight)
  window.visualViewport?.removeEventListener('resize', updateAppHeight)
  document.documentElement.classList.remove('keyboard-open')
})
</script>
