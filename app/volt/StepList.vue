<template>
  <StepList
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    unstyled>
    <slot />
  </StepList>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ptViewMerge } from './utils'
import StepList, {
  type StepListPassThroughOptions,
  type StepListProps
} from 'primevue/steplist'

interface Props extends /* @vue-ignore */ StepListProps {}
defineProps<Props>()

const theme = ref<StepListPassThroughOptions>({
  root: `relative flex justify-between items-center m-0 p-0 list-none overflow-x-auto`
})
</script>
