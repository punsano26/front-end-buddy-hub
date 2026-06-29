<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
    <div
      ref="chatScrollContainer"
      class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 lg:px-8 xl:px-12">
      <div class="flex flex-col gap-3 w-full">
        <!-- Chat Start Indicator -->
        <div class="my-4 select-none text-center">
          <span class="bg-slate-200/50 font-medium inline-block px-3 py-1 rounded-full text-[11px] text-slate-400 dark:bg-slate-800/40 dark:text-slate-500">
            เริ่มสนทนาบริการเพื่อนเช่าคุยออนไลน์แล้ว
          </span>
        </div>

        <!-- Empty State -->
        <div
          v-if="store.messages.length === 0"
          class="flex flex-col items-center justify-center px-4 py-12 select-none text-center">
          <div class="bg-slate-100 flex h-16 items-center justify-center mb-4 rounded-full shadow-inner text-slate-400 w-16 dark:bg-slate-900 dark:text-slate-650">
            <i class="animate-pulse pi pi-comments text-2xl" />
          </div>
          <p class="font-bold text-slate-700 text-sm dark:text-slate-200">
            ยังไม่มีข้อความ
          </p>
          <p class="max-w-[240px] mt-1 text-slate-400 text-xs dark:text-slate-500">
            เริ่มบทสนทนาของคุณโดยพิมพ์ข้อความและกดส่งด้านล่างได้เลยค่ะ
          </p>
        </div>

        <!-- Message bubbles -->
        <div
          v-for="chat in store.messages"
          :key="chat.id"
          :class="isOwnMessage(chat) ? 'justify-end' : 'justify-start'"
          class="flex group w-full">
          <div class="flex flex-col max-w-[85%] min-w-0 sm:max-w-[75%] lg:max-w-[60%]">
            <div
              :class="isOwnMessage(chat) ? 'flex-row' : 'flex-row-reverse'"
              class="flex items-end gap-2 min-w-0">
              <!-- Message Action Menu -->
              <DotMenu
                v-if="isOwnMessage(chat) && !isMessagePending(chat)"
                :class="[
                  isMessageMenuVisible(chat.id)
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none',
                  'transition-opacity duration-150 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-auto self-center'
                ]"
                :items="getMessageMenuItems(chat)" />

              <!-- Message Bubble -->
              <div
                :class="
                  isOwnMessage(chat)
                    ? 'bg-gradient-primary text-white rounded-br-xs shadow-indigo-500/10 dark:shadow-indigo-950/20'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                "
                class="flex flex-col gap-1 max-w-full min-w-0 px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200"
                @click="onMessageTap(chat)">
                <!-- Text Block -->
                <p class="break-words leading-relaxed text-sm whitespace-pre-wrap">
                  {{ chat.text }}
                </p>

                <!-- Time & Read Status -->
                <div class="flex gap-1.5 items-center justify-end mt-1 select-none">
                  <p
                    :class="isOwnMessage(chat) ? 'text-white/75' : 'text-slate-400 dark:text-slate-500'"
                    class="text-[10px]">
                    {{ dayjs(chat.createdAt).format('hh:mm A') }}
                  </p>

                  <template v-if="isOwnMessage(chat)">
                    <i
                      v-if="isMessagePending(chat)"
                      class="pi pi-spin pi-spinner text-[9px] text-white/70" />
                    <i
                      v-else
                      :class="
                        chat.isRead
                          ? 'text-emerald-300 dark:text-emerald-400 pi pi-check-circle'
                          : 'text-white/60 pi pi-circle-off'
                      "
                      class="text-[9px]" />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Simulated Typing Indicator -->
        <Transition name="fade">
          <div
            v-if="store.isTyping && store.currentPartner?.sessionStatus !== 'finished'"
            class="flex justify-start">
            <div class="bg-white border border-slate-200/85 flex gap-2 items-center px-4 py-3 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <span class="text-slate-400 text-xs dark:text-slate-500">กำลังพิมพ์</span>
              <div class="flex gap-1">
                <span
                  class="animate-bounce bg-blue-500 h-1.5 rounded-full w-1.5"
                  style="animation-delay: 0s" />
                <span
                  class="animate-bounce bg-blue-500 h-1.5 rounded-full w-1.5"
                  style="animation-delay: 0.15s" />
                <span
                  class="animate-bounce bg-blue-500 h-1.5 rounded-full w-1.5"
                  style="animation-delay: 0.3s" />
              </div>
            </div>
          </div>
        </Transition>

        <!-- Session Ended Notice Block -->
        <Transition name="fade">
          <div
            v-if="store.currentPartner?.sessionStatus === 'finished'"
            class="my-6 select-none text-center">
            <div class="bg-rose-50/30 border border-rose-100/70 flex flex-col gap-1.5 items-center max-w-sm mx-auto px-6 py-4 rounded-2xl shadow-sm dark:border-rose-950/20 dark:bg-rose-950/10">
              <span class="bg-rose-100 flex h-8 items-center justify-center rounded-full shadow-inner text-rose-500 w-8 dark:bg-rose-950">
                <i class="pi pi-lock text-xs" />
              </span>
              <span class="font-bold text-slate-700 text-xs dark:text-slate-355">การสนทนาสิ้นสุดแล้ว</span>
              <span class="text-[11px] text-slate-450 dark:text-slate-500">เซสชันของเพื่อนเช่าคุยนี้เสร็จสมบูรณ์แล้ว ขอบคุณที่ใช้บริการ Buddy Hub ค่ะ</span>
            </div>
          </div>
        </Transition>

        <!-- Pending Approval Block -->
        <Transition name="fade">
          <div
            v-if="store.currentPartner?.sessionStatus === 'pending'"
            class="my-6 select-none text-center mx-auto max-w-md px-4">
            <div class="bg-amber-50/20 border border-amber-200 flex flex-col gap-3 items-center px-6 py-5 rounded-2xl shadow-sm dark:border-amber-950/20 dark:bg-amber-950/10">
              <span class="animate-pulse bg-amber-100 flex h-10 items-center justify-center rounded-full shadow-inner text-amber-500 w-10 dark:bg-amber-950">
                <i class="pi pi-clock text-sm" />
              </span>
              <span class="font-bold text-slate-750 text-xs dark:text-slate-200">รอการตอบรับ/อนุมัติจากผู้ให้บริการ</span>
              <p class="leading-relaxed max-w-xs text-[11px] text-slate-550 dark:text-slate-400">
                ส่งคำขอเช่าคุยจำนวน {{ store.currentPartner.maxDurationMinutes }} นาทีเรียบร้อยแล้ว กรุณารอผู้ให้บริการตอบรับ หรือคลิกตรวจสอบสถานะเพื่ออัปเดตข้อมูลค่ะ
              </p>
              <div class="flex gap-2 justify-center mt-2.5 w-full">
                <Button
                  icon="pi pi-refresh"
                  label="ตรวจสอบสถานะ"
                  pt:label:class="font-semibold text-xs text-slate-700 dark:text-slate-200"
                  pt:root:class="border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-xl bg-transparent"
                  @click="emit('check-approval')" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import type { IItems } from '~/models/Global.model'
import { useRentChatStore } from '~/stores/RentChat'
import DotMenu from '~/components/DotMenu.vue'
import Button from '~/volt/Button.vue'

const store = useRentChatStore()
const emit = defineEmits<{
  (e: 'edit', message: { id: number, text: string }): void
  (e: 'check-approval'): void
}>()

const chatScrollContainer = ref<HTMLElement | null>(null)
const activeMenuMessageId = ref<number | null>(null)
const isCompactScreen = ref(false)
let screenQuery: MediaQueryList | null = null

const silentLoadingUnit = ref(false)
const { $handleLoading } = useNuxtApp()

function isOwnMessage (message: { sender: 'self' | 'partner' }): boolean {
  return message.sender === 'self'
}

function isMessagePending (message: { isSending?: boolean, isEditing?: boolean }): boolean {
  return !!message.isSending || !!message.isEditing
}

function onMessageTap (message: { id: number, sender: 'self' | 'partner' }): void {
  if (!isCompactScreen.value || !isOwnMessage(message)) return

  activeMenuMessageId.value
    = activeMenuMessageId.value === message.id ? null : message.id
}

function isMessageMenuVisible (messageId: number): boolean {
  return isCompactScreen.value && activeMenuMessageId.value === messageId
}

function getMessageMenuItems (message: { id: number, text: string }): IItems[] {
  return [
    { label: 'แก้ไข', command: (): void => startEditMessage(message) },
    {
      label: 'ลบ',
      command: (): Promise<void> => confirmDeleteMessage(message)
    }
  ]
}

function startEditMessage (message: { id: number, text: string }): void {
  store.startEditMessage(message)
  emit('edit', message)
}

async function confirmDeleteMessage (message: { id: number }): Promise<void> {
  if (!store.item) return
  await $handleLoading(async (): Promise<void> => {
    await store.confirmDeleteMessage(message.id, store.item!.id)
  }, {
    loadingUnit: silentLoadingUnit
  })
}

const scrollToBottom = async (): Promise<void> => {
  await nextTick()
  if (chatScrollContainer.value) {
    chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
  }
}

const handleScreenChange = (event: MediaQueryListEvent): void => {
  isCompactScreen.value = event.matches
  if (!event.matches) {
    activeMenuMessageId.value = null
  }
}

onMounted((): void => {
  screenQuery = window.matchMedia('(max-width: 639px)')
  isCompactScreen.value = screenQuery.matches
  screenQuery.addEventListener('change', handleScreenChange)
  void scrollToBottom()
})

onBeforeUnmount((): void => {
  if (screenQuery) {
    screenQuery.removeEventListener('change', handleScreenChange)
    screenQuery = null
  }
})

// Watch messages length changes to trigger auto scroll
watch(
  (): number => store.messages.length, (): void => {
    void scrollToBottom()
  }
)

defineExpose({
  scrollToBottom
})
</script>
