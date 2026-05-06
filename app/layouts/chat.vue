<template>
  <div class="flex min-h-[var(--app-height,100dvh)] h-[var(--app-height,100dvh)] flex-col overflow-hidden">
    <tools-bar :class="isChatIndex ? 'block md:block' : 'hidden md:block'" />
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <sidebar-chat
        :class="isChatIndex ? 'w-full block md:w-80 md:block' : 'hidden md:w-80 md:block'"
        class="h-full min-h-0 overflow-hidden border-r border-gray-800" />
      <div
        :class="isChatIndex ? 'hidden md:block' : 'block'"
        class="flex flex-1 min-h-0 flex-col overflow-hidden overscroll-y-contain">
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
