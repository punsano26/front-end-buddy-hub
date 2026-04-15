<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden border-r border-gray-800 p-4">
    <h2 class="shrink-0">
      Message
    </h2>

    <InputSearch
      class="my-4 shrink-0"
      placeholder="Search messages..." />

    <div class="flex-1 min-h-0 md:h-[38rem] overflow-y-auto overscroll-contain pr-1">
      <div class="grid gap-1">
        <ConversationItems
          v-for="(conversation, index) in conversations"
          :key="index"
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

// const id = computed((): number => Number(route.params.id))
const chatService: IChatProvider = new ChatProvider()
const conversations = ref<IFindAllConversationsList[]>([])
// const route = useRoute()
const { pagination, extractPagination } = usePagination()
const { $handleLoading } = useNuxtApp()
async function useFetch (): Promise<void> {
  const response = await chatService.findAllConversationsPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  })
  conversations.value = response.data || []
  extractPagination(response)
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>

</style>
