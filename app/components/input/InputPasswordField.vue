<template>
  <Password
    v-model="model"
    pt:maskicon:class="hidden"
    pt:overlay:class="hidden"
    pt:unmaskicon:class="hidden"
    fluid
    toggle-mask />
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<style scoped>

</style>
