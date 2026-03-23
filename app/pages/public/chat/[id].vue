<template>
  <div class="h-full flex flex-col overflow-hidden">
    <HeaderChatRoom class="shrink-0" />

    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-4">
        <div
          v-for="message in chatData.messages"
          :key="message.id"
          :class="message.isCurrentUser ? 'flex justify-end' : 'flex'"
        >
          <div class="flex flex-col max-w-[70%]">
            <div
              class="flex flex-col gap-1 p-3 rounded-2xl shadow-sm"
              :class="
                message.isCurrentUser
                  ? 'bg-gradient-primary text-black rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
              "
            >
              <p class="text-sm">{{ message.content }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ message.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DirectMessageChatRoom class="shrink-0" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "chat" });

const chatData = ref({
  messages: [
    {
      id: 1,
      sender: "Alice",
      content: "Hi there! How are you?",
      timestamp: "10:00 AM",
      isCurrentUser: false,
    },
    {
      id: 2,
      sender: "You",
      content: "I am good, thanks! How about you?",
      timestamp: "10:01 AM",
      isCurrentUser: true,
    },
    {
      id: 3,
      sender: "Alice",
      content: "I am doing well too! What are you up to?",
      timestamp: "10:02 AM",
      isCurrentUser: false,
    },
    {
      id: 4,
      sender: "You",
      content: "Just working on a project. How about you?",
      timestamp: "10:03 AM",
      isCurrentUser: true,
    },
    {
      id: 5,
      sender: "Alice",
      content: "Same here! Let’s catch up later.",
      timestamp: "10:04 AM",
      isCurrentUser: false,
    },
    {
      id: 6,
      sender: "You",
      content: "Sure! Talk to you later.",
      timestamp: "10:05 AM",
      isCurrentUser: true,
    },
    {
      id: 7,
      sender: "Alice",
      content: "Bye!",
      timestamp: "10:06 AM",
      isCurrentUser: false,
    },
    {
      id: 8,
      sender: "You",
      content: "Bye!",
      timestamp: "10:07 AM",
      isCurrentUser: true,
    },
    {
      id: 9,
      sender: "Alice",
      content: "See you later!",
      timestamp: "10:08 AM",
      isCurrentUser: false,
    },
  ],
});
</script>

<style scoped></style>
