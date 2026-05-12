<template>
  <div>
    <div class="sticky top-0 z-10">
      <ToolsBar />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import ToolsBar from '~/components/app/ToolsBar.vue'
</script>

<style scoped>

</style>
