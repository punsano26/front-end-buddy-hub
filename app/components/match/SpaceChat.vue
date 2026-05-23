<template>
  <div class="flex-1 min-h-0 flex flex-col bg-surface-50 dark:bg-surface-950 md:bg-white md:dark:bg-surface-900 overflow-hidden">
    <!-- Messages Viewport -->
    <div
      ref="chatScrollContainer"
      class="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth overscroll-y-contain">
      <!-- Premium Empty Welcome State -->
      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center h-full py-12 text-center select-none">
        <div class="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950/20 flex items-center justify-center text-primary-500 dark:text-primary-400 mb-4 animate-pulse">
          <i class="pi pi-comments text-2xl" />
        </div>
        <p class="text-base font-bold text-surface-900 dark:text-surface-0 mb-1">
          เริ่มต้นพูดคุยกับเพื่อนใหม่ของคุณ!
        </p>
        <p class="text-xs text-surface-500 dark:text-surface-400 max-w-xs leading-relaxed">
          ข้อมูลส่วนตัวของคุณจะปลอดภัยและถูกซ่อนไว้จนกว่าคุณทั้งคู่จะเป็นเพื่อนกัน
        </p>
      </div>

      <!-- Messages List -->
      <template v-else>
        <div
          v-for="message in messages"
          :key="message.id"
          :class="message.isOwn ? 'justify-end' : 'justify-start'"
          class="flex w-full">
          <div
            :class="message.isOwn
              ? 'bg-gradient-primary text-slate-950 font-medium rounded-2xl rounded-tr-xs shadow-sm hover:shadow-md'
              : 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-0 border border-surface-200/50 dark:border-surface-700/50 rounded-2xl rounded-tl-xs shadow-xs hover:shadow-sm'"
            class="max-w-[80%] md:max-w-[70%] px-4 py-2.5 text-sm transition-all duration-200 bubble-animation">
            <p class="wrap-break-word whitespace-pre-wrap leading-relaxed m-0">
              {{ message.text }}
            </p>
            <span
              :class="message.isOwn ? 'text-slate-800 text-right' : 'text-surface-450 dark:text-surface-500 text-left'"
              class="mt-1 block text-[10px] select-none opacity-80">
              {{ formatTime(message.sendAt) }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Chat Input Room Component -->
    <DirectMessageChatRoom
      v-model="messageText"
      :allow-media="false"
      class="shrink-0 border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 safe-area-pad px-3 py-2 z-10"
      @create-message="sendMessage" />
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

<style scoped>
@keyframes bubbleIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.bubble-animation {
  animation: bubbleIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
</style>
