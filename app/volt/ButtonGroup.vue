<template>
  <ButtonGroup
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    unstyled>
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps">
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}" />
    </template>
  </ButtonGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ptViewMerge } from './utils'
import ButtonGroup, {
  type ButtonGroupPassThroughOptions,
  type ButtonGroupProps
} from 'primevue/buttongroup'

interface Props extends /* @vue-ignore */ ButtonGroupProps {}
defineProps<Props>()

const theme = ref<ButtonGroupPassThroughOptions>({
  root: `*:rounded-none *:first:rounded-s-md *:last:rounded-e-md
        *:focus-visible:relative *:focus-visible:z-10 *:not-last:border-r-0`
})
</script>
