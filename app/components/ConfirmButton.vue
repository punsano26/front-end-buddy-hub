<template>
  <Button
    :label="text"
    :variant="variant"
    class="bg-white">
    <template #icon>
      <slot name="icon" />
    </template>
  </Button>
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'

interface IProps {
  text?: string
  variant?: string
}

withDefaults(defineProps<IProps>(), {
  text: '',
  variant: ''
})
</script>

<style scoped>
</style>
