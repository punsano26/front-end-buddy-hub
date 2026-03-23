<template>
  <Card pt:root:class="w-full rounded-none">
    <template #content>
      <div class="flex gap-2">
        <InputLabelField
          placeholder="พิมพ์ข้อความของคุณนี่ที่..." />
        <Button
          class="ml-2"
          color="primary">
          ส่ง
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import InputLabelField from './input/InputLabelField.vue'
</script>

<style scoped>

</style>
