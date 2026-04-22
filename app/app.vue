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
</script>
