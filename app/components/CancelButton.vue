<template>
  <Button
    :label="text"
    class=""
    variant="outlined" />
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'

interface IProps {
  text?: string
}

withDefaults(defineProps<IProps>(), {
  text: ''
})
</script>

<style scoped>
</style>
