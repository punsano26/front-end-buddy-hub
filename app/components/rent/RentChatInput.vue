<template>
  <div class="bg-white/95 border-t border-slate-200/80 chat-room-input-container backdrop-blur-md px-4 pt-3 transition-colors duration-250 dark:border-slate-850 dark:bg-slate-900/95">
    <!-- Editing message banner -->
    <Transition name="fade">
      <div
        v-if="store.editingMessageId !== null"
        class="bg-violet-50/80 border border-violet-100/50 flex items-center justify-between mb-2 px-3.5 py-2 rounded-xl dark:bg-violet-950/20 dark:border-violet-900/30">
        <div class="flex items-center gap-3">
          <div class="bg-gradient-primary flex h-7 items-center justify-center rounded-lg shadow-sm text-white w-7">
            <i class="pi pi-pencil text-xs" />
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-slate-800 text-xs dark:text-slate-200">กำลังแก้ไขข้อความ</span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400">Edit your message</span>
          </div>
        </div>
        <button
          class="flex h-7 items-center justify-center rounded-full transition w-7 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          type="button"
          @click="cancelEditMessage">
          <i class="pi pi-times text-xs" />
        </button>
      </div>
    </Transition>

    <div
      :class="store.currentPartner?.sessionStatus === 'finished' || store.currentPartner?.sessionStatus === 'pending' ? 'opacity-65 cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-850' : 'focus-within:border-slate-350 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 dark:focus-within:border-slate-750 dark:focus-within:bg-slate-950/60 dark:focus-within:ring-indigo-500/5'"
      class="bg-slate-50/50 border border-slate-200 flex gap-2.5 items-end min-h-[42px] px-3.5 py-2 rounded-2xl shadow-inner transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/30">
      <!-- Decoration Option (Sticker/Image mockup) -->
      <button
        :disabled="store.currentPartner?.sessionStatus === 'finished' || store.currentPartner?.sessionStatus === 'pending'"
        class="active:scale-95 flex h-8 items-center justify-center rounded-xl shrink-0 text-slate-500 transition w-8 hover:bg-slate-200/50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 disabled:opacity-50 disabled:hover:bg-transparent"
        type="button"
        @click="emit('sticker-click')">
        <i class="pi pi-image text-lg" />
      </button>

      <!-- Input field -->
      <div class="flex-1 min-w-0 pb-0.5">
        <textarea
          v-model="text"
          :disabled="store.currentPartner?.sessionStatus === 'finished' || store.currentPartner?.sessionStatus === 'pending'"
          :placeholder="store.currentPartner?.sessionStatus === 'finished' ? 'เซสชันสิ้นสุดลงแล้ว...' : store.currentPartner?.sessionStatus === 'pending' ? 'กำลังรอผู้ให้บริการตอบรับคำขอ...' : 'พิมพ์ข้อความ...'"
          class="chat-input w-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
          rows="1"
          @keydown.enter.prevent="handleSendMessage" />
      </div>

      <!-- Send Button -->
      <button
        :class="
          text.trim() && store.currentPartner?.sessionStatus !== 'finished' && store.currentPartner?.sessionStatus !== 'pending'
            ? 'bg-gradient-primary text-white shadow-md shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-95'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
        "
        :disabled="!text.trim() || store.currentPartner?.sessionStatus === 'finished' || store.currentPartner?.sessionStatus === 'pending'"
        class="active:scale-95 flex h-8 items-center justify-center rounded-xl shrink-0 transition-all duration-180 w-8 hover:scale-105 disabled:hover:scale-100"
        type="button"
        @click="handleSendMessage">
        <i :class="store.editingMessageId !== null ? 'pi pi-check text-xs' : 'pi pi-send text-xs'" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRentChatStore } from '~/stores/RentChat'

const store = useRentChatStore()
const text = defineModel<string>({ default: '' })

const emit = defineEmits<{
  (e: 'sticker-click'): void
  (e: 'send', value: string): void
}>()

function cancelEditMessage (): void {
  store.cancelEditMessage()
  text.value = ''
}

function handleSendMessage (): void {
  const trimmed = text.value.trim()
  if (!trimmed || store.currentPartner?.sessionStatus === 'finished' || store.currentPartner?.sessionStatus === 'pending') return
  emit('send', trimmed)
}
</script>

<style scoped>
.chat-input {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  resize: none !important;
  padding: 4px 0 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  min-height: 24px !important;
  max-height: 120px !important;
  overflow-y: auto !important;
}

.chat-input:focus {
  outline: none !important;
  box-shadow: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.chat-room-input-container {
  padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem);
}

/* When any input inside is focused (keyboard is visible), remove safe-area padding */
.chat-room-input-container:has(textarea:focus, input:focus) {
  padding-bottom: 0.75rem;
}
</style>
