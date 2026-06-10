<template>
  <NuxtLink>
    <Card>
      <template #content>
        <div class="flex items-center gap-2">
          <img
            alt="profile image"
            class="w-10 h-10 rounded-sm object-cover shrink-0"
            src="/png/upload-profile.png">
          <div class="flex justify-between">
            <p>{{ props.conversation.nickname || props.conversation.username }}</p>
            <Badge :value="props.conversation.type" />
          </div>
          <div>
            <p>{{ props.conversation.lastMessageText }}</p>
          </div>
          <div>
            <div class="flex gap-1">
              <i class="pi pi-coin text-gray-500" />
              <span class="text-sm text-gray-500">100/นาที</span>
            </div>
            <i class="pi pi-clock text-gray-500" />
            <span class="text-xs text-gray-400 whitespace-nowrap shrink-0 ml-2">
              {{ dayjs(props.conversation.lastMessageCreatedAt).format('hh:mm A') }}
            </span>
          </div>
        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  conversation: any
}>()
</script>

<style scoped>

</style>
