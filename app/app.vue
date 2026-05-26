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
  const layoutHeight = window.innerHeight
  const visualHeight = viewport?.height ?? layoutHeight
  const offsetTop = viewport?.offsetTop ?? 0
  const keyboardInset = Math.max(0, layoutHeight - (visualHeight + offsetTop))
  const keyboardOpen = keyboardInset > 120

  document.documentElement.style.setProperty('--app-height', `${visualHeight}px`)
  document.documentElement.style.setProperty('--keyboard-offset', '0px')
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

watch((): string => String(route.name || ''), (): void => {
  updateAppHeight()
})

onUnmounted((): void => {
  window.removeEventListener('resize', updateAppHeight)
  window.visualViewport?.removeEventListener('resize', updateAppHeight)
  document.documentElement.classList.remove('keyboard-open')
})
</script>
