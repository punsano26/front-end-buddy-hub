<template>
  <Card pt:root:class="w-full rounded-none">
    <template #content>
      <div class="flex gap-2">
        <InputLabelField
          v-model="message"
          placeholder="พิมพ์ข้อความของคุณนี่ที่..."
          @keyup.enter="handleSend" />
        <Button
          class="ml-2"
          color="primary"
          @click="handleSend">
          ส่ง
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import InputLabelField from './input/InputLabelField.vue'

const emit = defineEmits<{
  createMessage: [message: string]
}>()

const message = ref('')

function handleSend (): void {
  if (!message.value.trim()) return
  emit('createMessage', message.value.trim())
  message.value = ''
}
</script>
