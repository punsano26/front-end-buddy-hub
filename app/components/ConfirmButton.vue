<template>
  <Button
    :label="text"
    :variant="variant"
    class="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
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
