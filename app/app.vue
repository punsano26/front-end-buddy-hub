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
  const visualHeight = viewport?.height ?? window.innerHeight

  document.documentElement.style.setProperty('--app-height', `${visualHeight}px`)

  if (document.documentElement.classList.contains('keyboard-open')) {
    window.scrollTo(0, 0)
  }
}

const handleFocusIn = (event: FocusEvent): void => {
  const target = event.target as HTMLElement
  if (!target) return
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
    document.documentElement.classList.add('keyboard-open')
    nextTick((): void => {
      updateAppHeight()
      window.scrollTo(0, 0)
    })
  }
}

const handleFocusOut = (): void => {
  document.documentElement.classList.remove('keyboard-open')
  nextTick((): void => {
    updateAppHeight()
  })
}

onMounted((): void => {
  updateAppHeight()
  window.addEventListener('resize', updateAppHeight)
  window.visualViewport?.addEventListener('resize', updateAppHeight)
  window.visualViewport?.addEventListener('scroll', updateAppHeight)
  document.addEventListener('focusin', handleFocusIn)
  document.addEventListener('focusout', handleFocusOut)
})

watch((): string => String(route.name || ''), (): void => {
  updateAppHeight()
})

onUnmounted((): void => {
  window.removeEventListener('resize', updateAppHeight)
  window.visualViewport?.removeEventListener('resize', updateAppHeight)
  window.visualViewport?.removeEventListener('scroll', updateAppHeight)
  document.removeEventListener('focusin', handleFocusIn)
  document.removeEventListener('focusout', handleFocusOut)
  document.documentElement.classList.remove('keyboard-open')
})
</script>
