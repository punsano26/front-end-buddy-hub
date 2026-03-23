<template>
  <NuxtLink :to="{ name: 'public-chat-id', params: { id: props.conversation.id } }">
    <Card class="w-full">
      <template #content>
        <div class="flex items-center gap-4">
          <img
            alt="Alice"
            class="w-10 h-10 rounded-sm object-cover"
            src="/png/upload-profile.png">
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              {{ props.conversation.name }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ props.conversation.lastMessage }}
            </p>
          </div>
          <span class="text-xs text-gray-400">{{ props.conversation.timestamp }}</span>
        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  conversation: {
    id: number
    name: string
    lastMessage: string
    timestamp: string
  }
}>()
</script>

<style scoped>
</style>
