<template>
  <template v-if="isLoading">
    <slot name="skeleton">
      <div
        v-for="i in skeletonCount"
        :key="`default-skeleton-${i}`"
        class="animate-pulse bg-slate-200 h-20 w-full rounded" />
    </slot>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts">
interface Props {
  isLoading: boolean
  skeletonCount?: number
}

withDefaults(defineProps<Props>(), {
  skeletonCount: 1
})
</script>
