<template>
  <StepPanels
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    unstyled>
    <slot />
  </StepPanels>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ptViewMerge } from './utils'
import StepPanels, {
  type StepPanelsPassThroughOptions,
  type StepPanelsProps
} from 'primevue/steppanels'

interface Props extends /* @vue-ignore */ StepPanelsProps {}
defineProps<Props>()

const theme = ref<StepPanelsPassThroughOptions>({
  root: `pt-[0.875rem] pb-[1.125rem] px-2`
})
</script>
