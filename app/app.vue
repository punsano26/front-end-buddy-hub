<template>
  <NuxtLayout>
    <LoadingPopUp />
    <NuxtRouteAnnouncer />
    <Toast />
    <NuxtPage />
    <ConfirmCallDialog
      v-model:visible="isConfirmCallDialogVisible"
      :value="incomingCallData"
      @accept="clickAcceptCall"
      @reject="clickRejectCall" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { TErrorResponse } from './models/response/Response.model'
import ConfirmCallDialog from '~/components/call/ConfirmCallDialog.vue'
import LoadingPopUp from '~/components/loading/LoadingPopUp.vue'
import { useTokenRefresh } from '~/composables/useTokenRefresh'
import type { IInitiateCallData } from '~/models/response/CallRes.model'
import { useCallStore } from '~/stores/Call'

const route = useRoute()
const router = useRouter()
const { $handleLoading } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

useTokenRefresh()

const callStore = useCallStore()
const { incomingCallData } = storeToRefs(callStore)
const isConfirmCallDialogVisible = ref(false)

let ringtoneAudio: HTMLAudioElement | null = null

function playRingtone (): void {
  if (typeof window === 'undefined') return
  stopRingtone()
  ringtoneAudio = new Audio('https://res.cloudinary.com/epusyfzi/video/upload/v1785598973/calling_lbhqjm.mp3')
  ringtoneAudio.loop = true
  ringtoneAudio.play().catch((err: TErrorResponse): void => {
    console.warn('Autoplay prevented playing incoming call ringtone:', err)
  })
}

function stopRingtone (): void {
  if (ringtoneAudio) {
    ringtoneAudio.pause()
    ringtoneAudio = null
  }
}

watch(incomingCallData, (newVal: IInitiateCallData | null): void => {
  isConfirmCallDialogVisible.value = newVal !== null
  if (newVal) {
    playRingtone()
  } else {
    stopRingtone()
  }
})

async function onAcceptCall (): Promise<void> {
  if (!incomingCallData.value) return

  // Detect computer/desktop
  const isDesktop = typeof window !== 'undefined' && !((/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent))

  // Open window synchronously before the first await to bypass popup blocker
  let newWindow: Window | null = null
  if (isDesktop) {
    const width = 450
    const height = 650
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    newWindow = window.open('about:blank', '_blank', `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`)
  }

  try {
    await callStore.acceptIncomingCall(incomingCallData.value.id)
    if (callStore.callData) {
      const resolved = router.resolve({
        name: 'call',
        query: { callData: encodeURIComponent(JSON.stringify(callStore.callData)) }
      })
      if (newWindow) {
        newWindow.location.href = resolved.href
      } else {
        void router.push(resolved)
      }
    } else {
      if (newWindow) {
        newWindow.close()
      }
    }
  } catch (error: TErrorResponse) {
    if (newWindow) {
      newWindow.close()
    }
    throw error
  }
}

function clickAcceptCall (): void {
  $handleLoading(onAcceptCall)
}

async function onRejectCall (): Promise<void> {
  if (!incomingCallData.value) return
  await callStore.rejectIncomingCall(incomingCallData.value.id)
}

function clickRejectCall (): void {
  $handleLoading(onRejectCall)
}

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
  stopRingtone()
})
</script>
