<template>
  <div class="h-full flex flex-col overflow-hidden">
    <HeaderChatRoom class="shrink-0" />

    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-4">
        <div
          v-for="chat in chatData"
          :class="isOwnMessage(chat) ? 'flex justify-end' : 'flex'"
        >
          <div class="flex flex-col max-w-[70%]">
            <div class="flex items-center">
              <DotMenu :items="items"/>
              <div
                class="flex flex-col gap-1 p-3 rounded-2xl shadow-sm"
                :class="
                  isOwnMessage(chat)
                    ? 'bg-gradient-primary text-black rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                "
              >
                <p class="text-sm">{{ chat.messageText }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ chat.createdAt }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DirectMessageChatRoom @createMessage="sendMessage" class="shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { chatEnum } from '~/models/enums/Chat.enum'
import type { IItems } from '~/models/Global.model'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useAuthStore } from '~/stores/Auth'

const authStore = useAuthStore()
const chatService: IChatProvider = new ChatProvider()
const { $handleLoading, $ws } = useNuxtApp()
const { pagination, extractPagination } = usePagination()
const id = computed(() => Number(useRoute().params.id))
const items = computed((): IItems[] => {
  return [
    { label: 'แก้ไข', command: () => console.log('Edit message') },
    { label: 'ลบ', command: () => console.log('Delete message') },
  ]
})
definePageMeta({ layout: "chat" });

const form = ref<ICreateMessagePayload>({
 receiverId: id.value,
 messageType: chatEnum.TEXT,
 messageText: '',
})


const chatData = ref<ICreateMessageData[]>([]);
const wsListener = ref<((event: MessageEvent) => void) | null>(null)
const currentSocket = ref<WebSocket | null>(null)
const socketSyncInterval = ref<ReturnType<typeof setInterval> | null>(null)

function isChatMessageLike (value: unknown): value is ICreateMessageData {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  return typeof record.id === 'number'
    && typeof record.senderId === 'number'
    && typeof record.receiverId === 'number'
    && typeof record.messageType === 'string'
    && typeof record.messageText === 'string'
}

function isOwnMessage (message: ICreateMessageData): boolean {
  return message.senderId === authStore.user.id
}

function isCurrentConversationMessage (message: ICreateMessageData): boolean {
  const currentUserId = authStore.user.id
  const targetUserId = id.value

  if (currentUserId <= 0) {
    return message.senderId === targetUserId || message.receiverId === targetUserId
  }

  return (
    (message.senderId === currentUserId && message.receiverId === targetUserId)
    || (message.senderId === targetUserId && message.receiverId === currentUserId)
  )
}

function upsertMessage (message: ICreateMessageData): void {
  if (!isCurrentConversationMessage(message)) return

  const existingIndex = chatData.value.findIndex((item: ICreateMessageData): boolean => item.id === message.id)

  if (existingIndex >= 0) {
    chatData.value[existingIndex] = message
    return
  }

  chatData.value.push(message)
}

function extractMessagesFromSocket (payload: unknown): ICreateMessageData[] {
  if (!payload || typeof payload !== 'object') return []

  const body = payload as {
    event?: unknown
    data?: unknown
    message?: unknown
    messages?: unknown
  }

  const eventName = typeof body.event === 'string' ? body.event.toLowerCase() : ''
  const isChatEvent = eventName.includes('chat') || eventName.includes('message')

  if (!isChatEvent) return []

  const candidates: unknown[] = [
    body.data,
    body.message,
    body.messages,
    (body.data as { message?: unknown })?.message,
    (body.data as { messages?: unknown })?.messages
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item: unknown): item is ICreateMessageData => isChatMessageLike(item))
    }

    if (isChatMessageLike(candidate)) {
      return [candidate]
    }
  }

  return []
}

function removeSocketListener (): void {
  if (currentSocket.value && wsListener.value) {
    currentSocket.value.removeEventListener('message', wsListener.value)
  }

  currentSocket.value = null
  wsListener.value = null
}

function setupSocketListener (): void {
  const socket = $ws()

  if (!socket) {
    removeSocketListener()
    return
  }

  if (currentSocket.value === socket && wsListener.value) return

  removeSocketListener()

  const onMessage = (event: MessageEvent): void => {
    try {
      const payload: unknown = JSON.parse(event.data)
      const messages = extractMessagesFromSocket(payload)

      messages.forEach((message: ICreateMessageData): void => {
        upsertMessage(message)
      })
    } catch {
      // Ignore non-JSON websocket payload
    }
  }

  socket.addEventListener('message', onMessage)
  currentSocket.value = socket
  wsListener.value = onMessage
}

async function useFetch (): Promise<void> {
  const response = await chatService.findOneMessagePaginate({
    friendId: id.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
  })
  chatData.value = response.data || []
  pagination.value = extractPagination(response)
}
function fetch (): void {
  $handleLoading(useFetch)
}
async function onSendMessage (): Promise<void> {
  if (!form.value.messageText.trim()) return
  const payload = {
    receiverId: form.value.receiverId,
    messageType: form.value.messageType,
    messageText: form.value.messageText.trim(),
  }
  const response = await chatService.createMessage(payload)
  if (response.data) {
    upsertMessage(response.data)
  }
  form.value.messageText = ''
}

function sendMessage(messageText: string): void {
  form.value.messageText = messageText
  $handleLoading(onSendMessage)
}

onMounted((): void => {
  fetch()
  setupSocketListener()
  socketSyncInterval.value = setInterval((): void => {
    setupSocketListener()
  }, 200)
})

onUnmounted((): void => {
  if (socketSyncInterval.value) {
    clearInterval(socketSyncInterval.value)
    socketSyncInterval.value = null
  }
  removeSocketListener()
})

watch((): number => id.value, (nextId: number): void => {
  form.value.receiverId = nextId
  fetch()
})
</script>

<style scoped></style>
