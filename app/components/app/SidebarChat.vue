<template>
  <div class="h-full border-r border-gray-800 p-4">
    <h2>Message</h2>
    <InputSearch
      class="my-4"
      placeholder="Search messages..." />
    <div class="grid gap-1">
      <ConversationItems
        v-for="conversation in conversations"
        :key="conversation.id"
        :conversation="conversation" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationItems from '~/components/app/ConversationItems.vue'

const conversations = ref([
  {
    id: 1,
    name: 'Alice',
    lastMessage: 'Hey, how are you?',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    name: 'Bob',
    lastMessage: 'Are you coming to the party?',
    timestamp: '9:15 AM'
  },
  {
    id: 3,
    name: 'Charlie',
    lastMessage: 'Let\'s catch up soon!',
    timestamp: 'Yesterday'
  }
])
</script>

<style scoped>

</style>
