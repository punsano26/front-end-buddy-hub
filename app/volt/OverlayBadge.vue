<template>
  <div class="relative inline-flex">
    <slot />
    <Badge
      v-if="props.show"
      v-bind="$attrs"
      class="absolute top-0 end-0 translate-x-[50%] translate-y-[-50%] origin-top-right m-0 outline-2 outline-surface-0 dark:outline-surface-900" />
  </div>
</template>

<script setup lang="ts">
import Badge from './Badge.vue'
import type { BadgeProps } from 'primevue/badge'

interface Props extends /* @vue-ignore */ BadgeProps {
  show?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  show: true
})

defineOptions({
  inheritAttrs: false
})
</script>
