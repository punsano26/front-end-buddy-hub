<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden border-r border-gray-800 p-4">
    <h2 class="shrink-0">
      Message
    </h2>

    <InputSearch
      class="my-4 shrink-0"
      placeholder="Search messages..." />


    <div class="flex-1 min-h-0 md:h-152 overflow-y-auto overscroll-contain pr-1">
      <div class="grid gap-1">
        <ConversationItems
          v-for="conversation in conversations"
          :key="conversation.id"
          :conversation="conversation" />
      </div>
      <p
        v-if="conversations.length === 0"
        class="px-2 py-4 text-sm text-gray-500">
        No conversations yet.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ConversationItems from '~/components/app/ConversationItems.vue'
import type { IFindAllConversationsList } from '~/models/response/ChatRes.model'
import type { IChatProvider } from '~/resource/provider/Chat.provider'
import ChatProvider from '~/resource/provider/Chat.provider'
import { type ILatestConversationActivity, useChatStore } from '~/stores/Chat'

const chatService: IChatProvider = new ChatProvider()
const chatStore = useChatStore()
const conversations = ref<IFindAllConversationsList[]>([])
const isFetchingConversations = ref(false)
const { pagination, extractPagination } = usePagination()
const { $handleLoading } = useNuxtApp()

function moveConversationToTop (conversation: IFindAllConversationsList): void {
  conversations.value = [
    conversation,
    ...conversations.value.filter((item: IFindAllConversationsList): boolean => item.id !== conversation.id)
  ]
}

function applyRealtimeConversationActivity (activity: ILatestConversationActivity): void {
  const targetIndex = conversations.value.findIndex((item: IFindAllConversationsList): boolean => item.id === activity.otherUserId)

  if (targetIndex < 0) {
    fetch()
    return
  }

  const targetConversation = conversations.value[targetIndex]

  if (!targetConversation) return

  moveConversationToTop({
    ...targetConversation,
    lastMessage: activity.lastMessage,
    createdAt: activity.createdAt,
    messageType: activity.messageType
  })
}

async function useFetch (): Promise<void> {
  if (isFetchingConversations.value) return

  isFetchingConversations.value = true

  try {
    const response = await chatService.findAllConversationsPaginate({
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    conversations.value = response.data || []
    extractPagination(response)
  } finally {
    isFetchingConversations.value = false
  }
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})

watch((): ILatestConversationActivity | null => chatStore.latestConversationActivity, (activity: ILatestConversationActivity | null): void => {
  if (!activity) return

  applyRealtimeConversationActivity(activity)
})
</script>

<style scoped>

</style>
