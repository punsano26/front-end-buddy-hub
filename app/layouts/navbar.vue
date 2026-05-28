<template>
  <div>
    <div class="sticky top-0 z-50">
      <ToolsBar />
    </div>
    <div class="pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolsBar from '~/components/app/ToolsBar.vue'
</script>

<style scoped>

</style>
