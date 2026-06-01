<template>
  <div>
    <div class="sticky top-0 z-50">
      <ToolsBar />
    </div>
    <div class="pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0">
      <div class="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-10">
        <ButtonBack
          v-if="route.meta?.backPath && route.meta?.backPlacement !== 'page'"
          :to="route.meta?.backPath"
          icon="prime:chevron-left" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import ToolsBar from '~/components/app/ToolsBar.vue'

const route = useRoute()
</script>

<style scoped>

</style>
