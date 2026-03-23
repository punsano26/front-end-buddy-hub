<template>
  <div class="flex flex-col h-screen">
    <tools-bar />
    <div class="flex flex-1 overflow-hidden">
      <sidebar-chat
        :class="isChatIndex ? 'w-full block md:w-80 md:block' : 'hidden md:w-80 md:block'"
        class="border-r border-gray-800" />
      <div
        :class="isChatIndex ? 'hidden md:block' : 'block'"
        class="flex-1 overflow-auto">
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
