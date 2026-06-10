<template>
  <div class="flex min-h-[var(--app-height,100dvh)] h-[var(--app-height,100dvh)] flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <tools-bar
      :class="isChatIndex ? 'block md:block' : 'hidden md:block'" />
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <sidebar-chat
        :class="isChatIndex ? 'w-full block md:w-80 md:block' : 'hidden md:w-80 md:block'"
        class="h-full min-h-0 overflow-hidden border-r border-slate-250 dark:border-slate-850 bg-white dark:bg-black transition-all duration-300" />
      <div
        :class="isChatIndex ? 'hidden md:block' : 'block'"
        class="flex flex-1 min-h-0 flex-col overflow-hidden overscroll-y-contain bg-slate-50 dark:bg-slate-950/40 relative">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import ToolsBar from '~/components/app/ToolsBar.vue'
import SidebarChat from '~/components/rent/SidebarChat.vue'

const route = useRoute()
const isChatIndex = computed((): boolean => route.name === 'public-rent-chat')

const preventSafariScroll = (): void => {
  if (typeof window !== 'undefined' && window.scrollY !== 0) {
    window.scrollTo(0, 0)
  }
}

onMounted((): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('chat-layout-active')
    document.body.classList.add('chat-layout-active')
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', preventSafariScroll, { passive: true })
    window.addEventListener('focusin', preventSafariScroll)
  }
})

onUnmounted((): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('chat-layout-active')
    document.body.classList.remove('chat-layout-active')
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', preventSafariScroll)
    window.removeEventListener('focusin', preventSafariScroll)
  }
})
</script>

<style>
body.chat-layout-active,
html.chat-layout-active {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
  overscroll-behavior: none !important;
}
</style>
