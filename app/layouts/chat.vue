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

<script lang="ts" setup>
import { computed } from 'vue'
import SidebarChat from '~/components/app/SidebarChat.vue'
import ToolsBar from '~/components/app/ToolsBar.vue'

const route = useRoute()
const isChatIndex = computed((): boolean => route.name === 'public-chat')
</script>

<style>
</style>
