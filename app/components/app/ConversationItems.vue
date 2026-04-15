<template>
  <NuxtLink
    :to="{ name: 'public-chat-id', params: { id: props.conversation.id } }"
    class="block w-full min-w-0">
    <Card class="w-full max-w-full overflow-hidden">
      <template #content>
        <div class="flex items-center gap-3 min-w-0">

          <img
            class="w-10 h-10 rounded-sm object-cover shrink-0"
            src="/png/upload-profile.png">

          <div class="flex-1 min-w-0 overflow-hidden pr-2">
            <p class="font-semibold truncate">
              {{ props.conversation.nickname || props.conversation.username }}
            </p>


            <p class="text-sm text-gray-500 line-clamp-1">
              {{ props.conversation.lastMessage }}
            </p>
          </div>

          <span class="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2">
            {{ dayjs(props.conversation.createdAt).format('hh:mm A') }}
          </span>

        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { IFindAllConversationsList } from '~/models/response/ChatRes.model'

const props = defineProps<{
  conversation: IFindAllConversationsList
}>()
</script>

<style scoped>
</style>
