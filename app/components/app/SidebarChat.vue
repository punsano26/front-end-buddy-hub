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

const authStore = useAuthStore()
const chatService: IChatProvider = new ChatProvider()
const chatStore = useChatStore()
const conversations = ref<IFindAllConversationsList[]>([])
const isFetchingConversations = ref(false)
const isSyncingUnreadCount = ref(false)
const unreadPollingInterval = ref<ReturnType<typeof setInterval> | null>(null)
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

  void syncUnreadCountForConversation(activity.otherUserId)
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
    await useFetchCountUnread()
  } finally {
    isFetchingConversations.value = false
  }
}

function mapConversationUnreadCounts (
  entries: Array<{ friendId: number, unreadCount: number }>
): Record<number, number> {
  const unreadCounts: Record<number, number> = {}

  entries.forEach((entry: { friendId: number, unreadCount: number }): void => {
    if (!Number.isFinite(entry.friendId) || entry.friendId <= 0) return
    if (!Number.isFinite(entry.unreadCount) || entry.unreadCount <= 0) return

    unreadCounts[entry.friendId] = Math.floor(entry.unreadCount)
  })

  return unreadCounts
}

async function syncUnreadCountForConversation (friendId: number): Promise<void> {
  const currentUserId = authStore.user.id

  if (currentUserId <= 0 || friendId <= 0) return

  const response = await chatService.findAllUnreadMessages(friendId)
  const unreadCount = response.data?.unreadCount ?? 0

  chatStore.setConversationUnreadCount(friendId, unreadCount, currentUserId)
}

async function useFetchCountUnread (): Promise<void> {
  const currentUserId = authStore.user.id
  if (currentUserId <= 0) return

  if (isSyncingUnreadCount.value) return

  if (conversations.value.length === 0) {
    chatStore.setConversationUnreadCounts({}, currentUserId)
    return
  }

  isSyncingUnreadCount.value = true

  try {
    const snapshotConversations = [...conversations.value]
    const unreadResults = await Promise.allSettled(
      snapshotConversations.map((conversation: IFindAllConversationsList): Promise<Awaited<ReturnType<IChatProvider['findAllUnreadMessages']>>> => {
        return chatService.findAllUnreadMessages(conversation.id)
      })
    )

    const unreadEntries = unreadResults.reduce((entries: Array<{ friendId: number, unreadCount: number }>, result: PromiseSettledResult<Awaited<ReturnType<IChatProvider['findAllUnreadMessages']>>>, index: number): Array<{ friendId: number, unreadCount: number }> => {
      if (result.status !== 'fulfilled') return entries

      const targetConversation = snapshotConversations[index]
      if (!targetConversation) return entries

      entries.push({
        friendId: targetConversation.id,
        unreadCount: result.value.data?.unreadCount ?? 0
      })

      return entries
    }, [])

    chatStore.setConversationUnreadCounts(mapConversationUnreadCounts(unreadEntries), currentUserId)
  } finally {
    isSyncingUnreadCount.value = false
  }
}

function startUnreadPolling (intervalMs: number = 5000): void {
  stopUnreadPolling()

  unreadPollingInterval.value = setInterval((): void => {
    void useFetchCountUnread()
  }, intervalMs)
}

function stopUnreadPolling (): void {
  if (!unreadPollingInterval.value) return

  clearInterval(unreadPollingInterval.value)
  unreadPollingInterval.value = null
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
  startUnreadPolling()
})

onUnmounted((): void => {
  stopUnreadPolling()
})

watch((): ILatestConversationActivity | null => chatStore.latestConversationActivity, (activity: ILatestConversationActivity | null): void => {
  if (!activity) return

  applyRealtimeConversationActivity(activity)
})
</script>

<style scoped>

</style>
