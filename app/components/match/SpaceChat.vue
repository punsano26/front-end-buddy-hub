<template>
  <div class="mt-4 overflow-hidden rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900">
    <div class="flex h-105 flex-col">
      <div
        ref="chatScrollContainer"
        class="flex-1 overflow-y-auto px-4 py-4">
        <div
          v-if="messages.length === 0"
          class="text-center text-sm text-surface-500 dark:text-surface-400">
          เริ่มต้นด้วยการส่งข้อความแรกของคุณ
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="message.isOwn ? 'justify-end' : 'justify-start'"
            class="flex">
            <div
              :class="message.isOwn
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-surface-0 rounded-bl-md'"
              class="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm">
              <p class="wrap-break-word whitespace-pre-wrap">
                {{ message.text }}
              </p>
              <span
                :class="message.isOwn ? 'text-right' : 'text-left'"
                class="mt-1 block text-[10px] opacity-70">
                {{ formatTime(message.sendAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DirectMessageChatRoom
        v-model="messageText"
        :allow-media="false"
        class="shrink-0"
        @create-message="sendMessage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import DirectMessageChatRoom from '~/components/DirectMessageChatRoom.vue'
import type { ISendASessionMessagePayload } from '~/models/request/MatchReq.model'

export interface IMatchMessage {
  id: number | string
  text: string
  sendAt: string
  isOwn: boolean
}

const props = defineProps<{
  messages: IMatchMessage[]
}>()

const dayjs = useDayjs()
const messageText = ref('')
const chatScrollContainer = ref<HTMLElement | null>(null)
const emit = defineEmits<{
  (event: 'sendMessage', payload: ISendASessionMessagePayload): void
}>()

function formatTime (value: string): string {
  return dayjs(value).format('hh:mm A')
}

function sendMessage (message: string): void {
  const trimmed = message.trim()
  if (!trimmed) return

  emit('sendMessage', { text: trimmed })
  messageText.value = ''
}

async function scrollToBottom (): Promise<void> {
  await nextTick()
  if (!chatScrollContainer.value) return
  chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
}

watch((): number => props.messages.length, (): void => {
  void scrollToBottom()
})
</script>
