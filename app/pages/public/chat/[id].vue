<template>
  <div class="h-full flex flex-col overflow-hidden">
    <HeaderChatRoom class="shrink-0" />

    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-4">
        <div
          v-for="chat in chatData"
          :class="chat.senderId ? 'flex justify-end' : 'flex'"
        >
          <div class="flex flex-col max-w-[70%]">
            <div
              class="flex flex-col gap-1 p-3 rounded-2xl shadow-sm"
              :class="
                chat.senderId
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

    <DirectMessageChatRoom @createMessage="sendMessage" class="shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { chatEnum } from '~/models/enums/Chat.enum'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'

const chatService: IChatProvider = new ChatProvider()
const { $handleLoading } = useNuxtApp()
const { search, pagination, extractPagination } = usePagination()

const id = computed(() => Number(useRoute().params.id))
definePageMeta({ layout: "chat" });

const form = ref<ICreateMessagePayload>({
 receiverId: id.value,
 messageType: chatEnum.TEXT,
 messageText: '',
})

const chatData = ref<ICreateMessageData[]>([]);

async function useFetch (): Promise<void> {
  const response = await chatService.findOneMessagePaginate(id.value, {
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
  await chatService.createMessage(payload)
  form.value.messageText = ''
}

function sendMessage(messageText: string): void {
  form.value.messageText = messageText
  $handleLoading(onSendMessage)
}
</script>

<style scoped></style>
