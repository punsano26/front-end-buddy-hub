<template>
  <div class="flex min-h-[var(--app-height,100dvh)] h-[var(--app-height,100dvh)] flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <tools-bar
      :class="isChatIndex ? 'block md:block' : 'hidden md:block'" />
    <sidebar-chat
      :class="isChatIndex ? 'w-full block md:w-80 md:block' : 'hidden md:w-80 md:block'"
      class="h-full min-h-0 overflow-hidden border-r border-slate-250 dark:border-slate-850 transition-all duration-300" />
  </div>
</template>

<script setup lang="ts">
import ToolsBar from '~/components/app/ToolsBar.vue'
import SidebarChat from '~/components/rent/SidebarChat.vue'

const route = useRoute()
const isChatIndex = computed((): boolean => route.name === 'public-rent-chat')
</script>

<style scoped>

</style>
