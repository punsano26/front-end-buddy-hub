<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 relative transition-colors duration-250">
    <!-- Ambient subtle background decorative blurs -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/5 animate-pulse" style="animation-duration: 8s" />
      <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-600/5 animate-pulse" style="animation-duration: 12s; animation-delay: 1.5s" />
    </div>

    <template v-if="currentPartner">
      <header
        class="relative w-full shrink-0 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 pt-[calc(env(safe-area-inset-top)+0.6rem)] pb-3 px-4 md:px-6 transition-colors duration-250"
      >
        <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-primary opacity-60" />
        
        <div class="flex items-center justify-between gap-3 mx-auto max-w-7xl">
          <div class="flex items-center gap-3 min-w-0">
            <ButtonBack
              :to="{ name: 'public-rent-chat' }"
              class="shrink-0 transition-transform active:scale-95 text-slate-600 dark:text-slate-300"
              icon="mdi:arrow-left"
            />

            <div class="relative shrink-0">
              <img
                :src="partnerProfileImg"
                alt="Profile Image"
                class="w-10 h-10 rounded-xl object-cover border border-slate-200/60 dark:border-slate-800 shadow-sm"
                :class="currentPartner?.sessionStatus === 'finished' ? 'opacity-60 grayscale-[35%]' : ''"
              >
              <span
                v-if="currentPartner?.sessionStatus === 'finished'"
                class="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 border border-white dark:border-slate-900 text-white text-[8px] font-bold"
              >
                <i class="pi pi-times" />
              </span>
              <span
                v-else-if="partner?.isOnline === true"
                class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
              />
              <span
                v-else-if="partner?.isOnline === false"
                class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500 dark:border-slate-900"
              />
            </div>

            <!-- Partner Name & Category -->
            <div class="min-w-0 leading-tight">
              <div class="flex items-center gap-1.5">
                <p class="font-bold text-slate-850 dark:text-slate-50 text-sm md:text-base truncate">
                  {{ partnerName }}
                </p>
               
              </div>
              
              <p
                v-if="item?.status === RentStatusEnum.COMPLETED"
                class="text-[11px] font-semibold text-rose-500 flex items-center gap-1.5 mt-0.5"
              >
                <span class="h-1.5 w-1.5 bg-rose-500 rounded-full" />
                เซสชันสิ้นสุดแล้ว
              </p>
           
          
            </div>
          </div>

          <!-- Price Rate / Session overlay -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="flex items-center gap-1 border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950/50 rounded-lg px-2.5 py-1 text-xs">
              <i class="pi pi-coin text-amber-500" />
              <span class="font-bold text-slate-700 dark:text-slate-200">{{ countdownText }}</span>
              <span v-if="currentPartner?.sessionStatus === 'active'" class="text-slate-400">/นาที</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Messages Container -->
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          ref="chatScrollContainer"
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-6 lg:px-8 xl:px-12 py-4"
        >
          <div class="flex w-full flex-col gap-3">
            <!-- Chat Start Indicator -->
            <div class="text-center my-4 select-none">
              <span class="inline-block text-[11px] text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800/40 rounded-full px-3 py-1 font-medium">
                เริ่มสนทนาบริการเพื่อนเช่าคุยออนไลน์แล้ว
              </span>
            </div>

            <!-- Empty State -->
            <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center select-none">
              <div class="h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-650 shadow-inner">
                <i class="pi pi-comments text-2xl animate-pulse" />
              </div>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-200">ยังไม่มีข้อความ</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[240px]">
                เริ่มบทสนทนาของคุณโดยพิมพ์ข้อความและกดส่งด้านล่างได้เลยค่ะ
              </p>
            </div>

            <!-- Message bubbles -->
            <div
              v-for="chat in messages"
              :key="chat.id"
              class="group flex w-full"
              :class="isOwnMessage(chat) ? 'justify-end' : 'justify-start'"
            >
              <div class="flex min-w-0 max-w-[85%] flex-col sm:max-w-[75%] lg:max-w-[60%]">
                <div
                  class="flex items-end gap-2 min-w-0"
                  :class="isOwnMessage(chat) ? 'flex-row' : 'flex-row-reverse'"
                >
                  <!-- Message Action Menu -->
                  <DotMenu
                    v-if="isOwnMessage(chat) && !isMessagePending(chat)"
                    :items="getMessageMenuItems(chat)"
                    :message-id="chat.id"
                    :class="[
                      isMessageMenuVisible(chat.id)
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none',
                      'transition-opacity duration-150 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-auto self-center'
                    ]"
                  />

                  <!-- Message Bubble -->
                  <div
                    class="flex flex-col gap-1 px-4 py-2.5 rounded-2xl shadow-sm max-w-full min-w-0 transition-all duration-200"
                    @click="onMessageTap(chat)"
                    :class="
                      isOwnMessage(chat)
                        ? 'bg-gradient-primary text-white rounded-br-xs shadow-indigo-500/10 dark:shadow-indigo-950/20'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                    "
                  >
                    <!-- Text Block -->
                    <p class="text-sm break-words whitespace-pre-wrap leading-relaxed">
                      {{ chat.text }}
                    </p>

                    <!-- Time & Read Status -->
                    <div class="flex items-center justify-end gap-1.5 mt-1 select-none">
                      <p
                        class="text-[10px]"
                        :class="isOwnMessage(chat) ? 'text-white/75' : 'text-slate-400 dark:text-slate-500'"
                      >
                        {{ dayjs(chat.createdAt).format("hh:mm A") }}
                      </p>
                      
                      <template v-if="isOwnMessage(chat)">
                        <i
                          v-if="isMessagePending(chat)"
                          class="pi pi-spin pi-spinner text-white/70 text-[9px]"
                        />
                        <i
                          v-else
                          :class="
                            chat.isRead
                              ? 'text-emerald-300 dark:text-emerald-400 pi pi-check-circle'
                              : 'text-white/60 pi pi-circle-off'
                          "
                          class="text-[9px]"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simulated Typing Indicator -->
            <Transition name="fade">
              <div v-if="isTyping && currentPartner?.sessionStatus !== 'finished'" class="flex justify-start">
                <div class="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm">
                  <span class="text-xs text-slate-400 dark:text-slate-500">กำลังพิมพ์</span>
                  <div class="flex gap-1">
                    <span class="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s" />
                    <span class="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.15s" />
                    <span class="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.3s" />
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Session Ended Notice Block -->
            <Transition name="fade">
              <div v-if="currentPartner?.sessionStatus === 'finished'" class="text-center my-6 select-none">
                <div class="inline-flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl border border-rose-100/70 bg-rose-50/30 dark:border-rose-950/20 dark:bg-rose-950/10 max-w-sm mx-auto shadow-sm">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 shadow-inner">
                    <i class="pi pi-lock text-xs" />
                  </span>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-355">การสนทนาสิ้นสุดแล้ว</span>
                  <span class="text-[11px] text-slate-450 dark:text-slate-500">เซสชันของเพื่อนเช่าคุยนี้เสร็จสมบูรณ์แล้ว ขอบคุณที่ใช้บริการ Buddy Hub ค่ะ</span>
                </div>
              </div>
            </Transition>

            <!-- Pending Approval Block -->
            <Transition name="fade">
              <div v-if="currentPartner?.sessionStatus === 'pending'" class="text-center my-6 select-none mx-auto max-w-md px-4">
                <div class="inline-flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border border-amber-200 bg-amber-50/20 dark:border-amber-950/20 dark:bg-amber-950/10 shadow-sm">
                  <span class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 shadow-inner animate-pulse">
                    <i class="pi pi-clock text-sm" />
                  </span>
                  <span class="text-xs font-bold text-slate-750 dark:text-slate-200">รอการตอบรับ/อนุมัติจากผู้ให้บริการ</span>
                  <p class="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed max-w-xs">
                    ส่งคำขอเช่าคุยจำนวน {{ currentPartner.maxDurationMinutes }} นาทีเรียบร้อยแล้ว กรุณารอผู้ให้บริการตอบรับ หรือคลิกตรวจสอบสถานะเพื่ออัปเดตข้อมูลค่ะ
                  </p>
                  <div class="flex gap-2 w-full mt-2.5 justify-center">
                    <Button
                      label="ตรวจสอบสถานะ"
                      icon="pi pi-refresh"
                      pt:label:class="font-semibold text-xs text-slate-700 dark:text-slate-200"
                      pt:root:class="border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-xl bg-transparent"
                      @click="checkApprovalStatus" />
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Chat Room Input Container -->
        <div class="chat-room-input-container border-t border-slate-200/80 bg-white/95 px-4 pt-3 dark:border-slate-850 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-250">
          <!-- Editing message banner -->
          <Transition name="fade">
            <div
              v-if="isEditingMessage"
              class="mb-2 flex items-center justify-between rounded-xl bg-violet-50/80 border border-violet-100/50 px-3.5 py-2 dark:bg-violet-950/20 dark:border-violet-900/30"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary text-white shadow-sm">
                  <i class="pi pi-pencil text-xs" />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-800 dark:text-slate-200">กำลังแก้ไขข้อความ</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400">Edit your message</span>
                </div>
              </div>
              <button
                class="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-slate-200/50 dark:hover:bg-slate-800"
                type="button"
                @click="cancelEditMessage"
              >
                <i class="pi pi-times text-xs" />
              </button>
            </div>
          </Transition>

          <div 
            :class="currentPartner?.sessionStatus === 'finished' || currentPartner?.sessionStatus === 'pending' ? 'opacity-65 cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-850' : 'focus-within:border-slate-350 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/10 dark:focus-within:border-slate-750 dark:focus-within:bg-slate-950/60 dark:focus-within:ring-indigo-500/5'"
            class="flex min-h-[42px] items-end gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 shadow-inner transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/30"
          >
            <!-- Decoration Option (Sticker/Image mockup) -->
            <button
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200/50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400 active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent"
              type="button"
              :disabled="currentPartner?.sessionStatus === 'finished' || currentPartner?.sessionStatus === 'pending'"
              @click="showStickerAlert"
            >
              <i class="pi pi-image text-lg" />
            </button>

            <!-- Input field -->
            <div class="flex-1 min-w-0 pb-0.5">
              <textarea
                v-model="userMessageText"
                :placeholder="currentPartner?.sessionStatus === 'finished' ? 'เซสชันสิ้นสุดลงแล้ว...' : currentPartner?.sessionStatus === 'pending' ? 'กำลังรอผู้ให้บริการตอบรับคำขอ...' : 'พิมพ์ข้อความ...'"
                :disabled="currentPartner?.sessionStatus === 'finished' || currentPartner?.sessionStatus === 'pending'"
                class="chat-input w-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows="1"
                @keydown.enter.prevent="handleSendMessage"
              />
            </div>

            <!-- Send Button -->
            <button
              :class="
                userMessageText.trim() && currentPartner?.sessionStatus !== 'finished' && currentPartner?.sessionStatus !== 'pending'
                  ? 'bg-gradient-primary text-white shadow-md shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
              "
              :disabled="!userMessageText.trim() || currentPartner?.sessionStatus === 'finished' || currentPartner?.sessionStatus === 'pending'"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-180 hover:scale-105 disabled:hover:scale-100"
              type="button"
              @click="handleSendMessage"
            >
              <i :class="isEditingMessage ? 'pi pi-check text-xs' : 'pi pi-send text-xs'" />
            </button>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="flex flex-col items-center justify-center flex-1 py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-blue-500 mb-3" />
      <span class="text-sm font-medium text-slate-500 dark:text-400">กำลังโหลดห้องสนทนา...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useToast } from 'primevue/usetoast'
import { chatEnum } from '~/models/enums/Chat.enum'
import { RentStatusEnum } from '~/models/enums/Rent.enum'
import type { IItems } from '~/models/Global.model'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICustomer, IFindOneSessionsMessagesList, IProvider, IRentAPostData } from '~/models/response/RentRes.model'
import type { IRentCustomerProvider } from '~/resource/provider/RentCustomer.provider'
import RentCustomerProvider from '~/resource/provider/RentCustomer.provider'
import { useAuthStore } from '~/stores/Auth'
import Button from '~/volt/Button.vue'

definePageMeta({ layout: 'chat-rent', title: 'แชท' })

interface IRentAPostDataWithStatus extends IRentAPostData {
  sessionStatus?: string
}

interface IPartnerInfo {
  id: number
  nickname: string
  username: string
  profileImg: string
  status: string
  sessionStatus: 'active' | 'pending' | 'finished' | ''
  maxDurationMinutes: number
  welcomeMessage: string
}

interface IWebSocketPayload {
  event?: string
  data?: any
}

const route = useRoute()
const id = computed((): number => Number(route.params.id))
const form = ref<ICreateMessagePayload>({
  receiverId: id.value,
  messageType: chatEnum.TEXT,
  messageText: '',
})
const editingMessageId = ref<number | null>(null)
const authStore = useAuthStore()
const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

const chatScrollContainer = ref<HTMLElement | null>(null)
const userMessageText = ref('')
const isTyping = ref(false)
const toast = useToast()
const item = ref<IRentAPostData>()
const rentCustomerProvider: IRentCustomerProvider = new RentCustomerProvider()
const { pagination, extractPagination } = usePagination()
const { $handleLoading } = useNuxtApp()
const remainingSeconds = ref(0)
let timerInterval: any = null
const conversationsRent = useState<IRentAPostDataWithStatus[]>('conversationsRent', (): IRentAPostDataWithStatus[] => [])

const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const countdownText = computed((): string => {
  if (!currentPartner.value) return 'รออนุมัติ...'
  if (currentPartner.value.sessionStatus === 'pending') return 'รออนุมัติ...'
  if (currentPartner.value.sessionStatus === 'finished') return 'สิ้นสุดเซสชัน'
  return `นับถอยหลัง ${formatTime(remainingSeconds.value)}`
})

const startCountdown = (): void => {
  if (timerInterval) clearInterval(timerInterval)
  if (!currentPartner.value || currentPartner.value.sessionStatus !== 'active') return
  
  remainingSeconds.value = (currentPartner.value.maxDurationMinutes || 60) * 60
  timerInterval = setInterval((): void => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(timerInterval)
      if (currentPartner.value) {
        currentPartner.value.sessionStatus = 'finished'
      }
    }
  }, 1000)
}

const checkApprovalStatus = (): void => {
  toast.add({
    severity: 'info',
    summary: 'ตรวจสอบสถานะ',
    detail: 'กำลังตรวจสอบสถานะกับเซิร์ฟเวอร์...',
    life: 1500
  })
  fetch()
}

async function useFetch (): Promise<void> {
  const response = await rentCustomerProvider.findOneConversationSessionById(id.value)
  if (response.data) {
    item.value = response.data
    const idx = conversationsRent.value.findIndex((p: IRentAPostDataWithStatus): boolean => p.id === response.data.id)
    const isFinishedVal = response.data.status === RentStatusEnum.COMPLETED
      || response.data.status === RentStatusEnum.CANCELLED
      || response.data.status === RentStatusEnum.REJECTED
    const isPendingVal = response.data.status === RentStatusEnum.PENDING
    const statusStr = isPendingVal ? 'pending' : (isFinishedVal ? 'finished' : 'active')

    if (idx !== -1) {
      conversationsRent.value[idx] = {
        ...conversationsRent.value[idx],
        ...response.data,
        sessionStatus: statusStr
      }
    } else {
      conversationsRent.value.push({
        ...response.data,
        sessionStatus: statusStr
      })
    }
  }
}

function fetch (): void {
  $handleLoading(useFetch)
}

const silentLoadingUnit = ref(false)
const isMarkingRead = ref(false)

async function markSessionMessagesAsRead (): Promise<void> {
  if (isMarkingRead.value) return

  const currentUserId = authStore.user.id
  if (currentUserId <= 0 || id.value <= 0) return

  const hasUnread = messages.value.some(
    (m): boolean => m.sender === 'partner' && !m.isRead
  )
  if (!hasUnread) return

  isMarkingRead.value = true
  try {
    await rentCustomerProvider.markMessagesAsRead(id.value)
    messages.value = messages.value.map((m) => {
      if (m.sender === 'partner') {
        return { ...m, isRead: true }
      }
      return m
    })
  } catch (error) {
    console.error('Failed to mark messages as read:', error)
  } finally {
    isMarkingRead.value = false
  }
}

async function useFetchMessages (): Promise<void> {
  const response = await rentCustomerProvider.findOneSessionMessagesPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  }, id.value)

  if (response?.data) {
    const rawMessages: IFindOneSessionsMessagesList[] = response.data
    messages.value = rawMessages.map((m: IFindOneSessionsMessagesList) => ({
      id: m.id,
      sender: (m.senderId === authStore.user.id ? 'self' : 'partner') as 'self' | 'partner',
      text: m.messageText,
      createdAt: new Date(m.createdAt),
      isRead: m.isRead
    })).sort((a, b): number => Number(a.createdAt) - Number(b.createdAt))
  } else {
    messages.value = []
  }

  pagination.value = extractPagination(response?.pagination)
  await markSessionMessagesAsRead()
  void scrollToBottom()
}

function fetchMessages (): void {
  $handleLoading(useFetchMessages, { loadingUnit: silentLoadingUnit })
}

const { $ws } = useNuxtApp()
let socket: WebSocket | null = null
let socketInterval: any = null

const handleSocketMessage = (event: MessageEvent): void => {
  let payload: IWebSocketPayload
  try {
    payload = JSON.parse(event.data) as IWebSocketPayload
  } catch {
    return
  }
  if (!payload || !payload.event) return

  if (payload.event === 'service_new_message') {
    const data = payload.data
    if (data && data.hireSessionId === id.value) {
      if (!messages.value.some((m): boolean => m.id === data.id)) {
        messages.value.push({
          id: data.id,
          sender: (data.senderId === authStore.user.id ? 'self' : 'partner') as 'self' | 'partner',
          text: data.messageText,
          createdAt: new Date(data.createdAt),
          isRead: data.isRead
        })
        if (data.senderId !== authStore.user.id) {
          void markSessionMessagesAsRead()
        }
        void scrollToBottom()
      }
    }
  } else if (payload.event === 'service_message_updated') {
    const data = payload.data
    if (data && data.hireSessionId === id.value) {
      messages.value = messages.value.map((m) => {
        if (m.id === data.id) {
          return {
            ...m,
            text: data.messageText
          }
        }
        return m
      })
    }
  } else if (payload.event === 'service_message_deleted') {
    const data = payload.data
    const deletedId = data?.id || data
    if (deletedId) {
      messages.value = messages.value.filter((m) => m.id !== deletedId)
      if (editingMessageId.value === deletedId) {
        cancelEditMessage()
      }
    }
  } else if (payload.event === 'service_message_read') {
    messages.value = messages.value.map((m) => {
      if (m.sender === 'self') {
        return { ...m, isRead: true }
      }
      return m
    })
  }
}

const setupSocket = (): void => {
  const wsInstance = $ws()
  if (wsInstance && wsInstance !== socket) {
    if (socket) {
      socket.removeEventListener('message', handleSocketMessage)
    }
    socket = wsInstance
    socket.addEventListener('message', handleSocketMessage)
  }
}

const partner = computed((): ICustomer | IProvider | null => {
  if (item.value) {
    if (authStore.user.id === item.value.customerId) {
      return item.value.provider
    }
    return item.value.customer
  }
  const localPartner = conversationsRent.value.find((p: IRentAPostDataWithStatus): boolean => p.id === id.value)
  if (localPartner) {
    return localPartner.provider || localPartner.customer || null
  }
  return null
})

const partnerName = computed((): string => {
  const p = partner.value
  return p?.nickname || p?.username || ''
})

const partnerProfileImg = computed((): string => {
  const p = partner.value
  if (item.value && p?.profileImg) {
    return imageBaseUrl + p.profileImg
  }
  return p?.profileImg ? p.profileImg : '/png/upload-profile.png'
})

const currentPartner = computed((): IPartnerInfo | null => {
  const localPartner = conversationsRent.value.find((p: IRentAPostDataWithStatus): boolean => p.id === id.value)
  
  if (item.value) {
    const p = partner.value
    const isFinishedVal = item.value.status === RentStatusEnum.COMPLETED
      || item.value.status === RentStatusEnum.CANCELLED
      || item.value.status === RentStatusEnum.REJECTED
    const isPendingVal = item.value.status === RentStatusEnum.PENDING
    const statusStr = isPendingVal ? 'pending' : (isFinishedVal ? 'finished' : 'active')

    return {
      id: item.value.id,
      nickname: p?.nickname || p?.username || '',
      username: p?.username || '',
      profileImg: p?.profileImg ? imageBaseUrl + p.profileImg : '/png/upload-profile.png',
      status: p?.isOnline ? 'online' : 'offline',
      sessionStatus: (localPartner?.sessionStatus || statusStr) as 'active' | 'pending' | 'finished' | '',
      maxDurationMinutes: item.value.durationMinutes,
      welcomeMessage: item.value.hirePost?.tagline || ''
    }
  }

  if (localPartner) {
    const p = localPartner.provider || localPartner.customer
    return {
      id: localPartner.id,
      nickname: p?.nickname || p?.username || '',
      username: p?.username || '',
      profileImg: p?.profileImg ? imageBaseUrl + p.profileImg : '/png/upload-profile.png',
      status: p?.isOnline ? 'online' : 'offline',
      sessionStatus: (localPartner.sessionStatus || '') as 'active' | 'pending' | 'finished' | '',
      maxDurationMinutes: localPartner.durationMinutes,
      welcomeMessage: localPartner.hirePost?.tagline || ''
    }
  }

  return null
})

interface IRentMessageItem {
  id: number
  sender: 'self' | 'partner'
  text: string
  createdAt: Date
  isRead?: boolean
  isSending?: boolean
  isEditing?: boolean
}

const messages = ref<IRentMessageItem[]>([])

const scrollToBottom = async (): Promise<void> => {
  await nextTick()
  if (chatScrollContainer.value) {
    chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
  }
}

const isEditingMessage = computed((): boolean => editingMessageId.value !== null)
const activeMenuMessageId = ref<number | null>(null)
const isCompactScreen = ref(false)
let screenQuery: MediaQueryList | null = null

function isOwnMessage (message: { sender: 'self' | 'partner' }): boolean {
  return message.sender === 'self'
}

function isMessagePending (message: { isSending?: boolean; isEditing?: boolean }): boolean {
  return !!message.isSending || !!message.isEditing
}

function onMessageTap (message: { id: number; sender: 'self' | 'partner' }): void {
  if (!isCompactScreen.value || !isOwnMessage(message)) return

  activeMenuMessageId.value =
    activeMenuMessageId.value === message.id ? null : message.id
}

function isMessageMenuVisible (messageId: number): boolean {
  return isCompactScreen.value && activeMenuMessageId.value === messageId
}

function getMessageMenuItems (message: { id: number; text: string }): IItems[] {
  return [
    { label: 'แก้ไข', command: (): void => startEditMessage(message) },
    {
      label: 'ลบ',
      command: (): Promise<void> => confirmDeleteMessage(message)
    }
  ]
}

function startEditMessage (message: { id: number; text: string }): void {
  editingMessageId.value = message.id
  userMessageText.value = message.text
}

function cancelEditMessage (): void {
  editingMessageId.value = null
  userMessageText.value = ''
}

async function confirmDeleteMessage (message: { id: number }): Promise<void> {
  await $handleLoading(async (): Promise<void> => {
    await rentCustomerProvider.deleteSessionMessage(message.id, id.value)

    messages.value = messages.value.filter(
      (item): boolean => item.id !== message.id
    )

    if (editingMessageId.value === message.id) {
      cancelEditMessage()
    }
  }, {
    loadingUnit: silentLoadingUnit
  })
}

async function handleSendMessage (): Promise<void> {
  const text = userMessageText.value.trim()
  if (!text) return
  if (currentPartner.value?.sessionStatus === 'finished') return

  if (isEditingMessage.value) {
    const messageId = editingMessageId.value!
    await $handleLoading(async (): Promise<void> => {
      const response = await rentCustomerProvider.updateSessionMessage({
        messageText: text
      }, messageId, id.value)

      if (response.data) {
        messages.value = messages.value.map((m) => {
          if (m.id === messageId) {
            return {
              ...m,
              text: response.data.messageText
            }
          }
          return m
        })
      }
      cancelEditMessage()
    }, {
      loadingUnit: silentLoadingUnit
    })
  } else {
    await $handleLoading(async (): Promise<void> => {
      const response = await rentCustomerProvider.createSessionMessage({
        messageType: chatEnum.TEXT,
        messageText: text
      }, id.value)

      if (response.data) {
        const data: IFindOneSessionsMessagesList = response.data
        if (!messages.value.some((m): boolean => m.id === data.id)) {
          messages.value.push({
            id: data.id,
            sender: (data.senderId === authStore.user.id ? 'self' : 'partner') as 'self' | 'partner',
            text: data.messageText,
            createdAt: new Date(data.createdAt),
            isRead: data.isRead
          })
          void scrollToBottom()
        }
      }
      userMessageText.value = ''
    }, {
      loadingUnit: silentLoadingUnit
    })
  }
}

function showStickerAlert (): void {
  toast.add({
    severity: 'info',
    summary: 'ฟีเจอร์รูปภาพ/สติกเกอร์',
    detail: 'ฟีเจอร์ส่งรูปภาพ/สติกเกอร์จะเปิดให้บริการในเร็วๆ นี้ค่ะ',
    life: 2000
  })
}

const handleScreenChange = (event: MediaQueryListEvent): void => {
  isCompactScreen.value = event.matches
  if (!event.matches) {
    activeMenuMessageId.value = null
  }
}

onMounted((): void => {
  setupSocket()
  socketInterval = setInterval(setupSocket, 1000)
  fetch()
  fetchMessages()

  screenQuery = window.matchMedia('(max-width: 639px)')
  isCompactScreen.value = screenQuery.matches
  screenQuery.addEventListener('change', handleScreenChange)
})

onBeforeUnmount((): void => {
  if (socket) {
    socket.removeEventListener('message', handleSocketMessage)
  }
  if (socketInterval) {
    clearInterval(socketInterval)
  }
  if (screenQuery) {
    screenQuery.removeEventListener('change', handleScreenChange)
    screenQuery = null
  }
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

// Watch route parameter changes to re-initialize
watch(
  (): number => id.value,
  (nextId: number, previousId?: number): void => {
    cancelEditMessage()
    activeMenuMessageId.value = null
    fetch()
    fetchMessages()
  },
  { immediate: true }
)

// Watch sessionStatus or partner ID changes to trigger countdown
watch(
  [(): number | undefined => currentPartner.value?.id, (): string | undefined => currentPartner.value?.sessionStatus],
  (): void => {
    if (currentPartner.value?.sessionStatus === 'active') {
      startCountdown()
    } else {
      if (timerInterval) clearInterval(timerInterval)
    }
  },
  { immediate: true }
)

watch(
  (): number => messages.value.length,
  (): void => {
    void scrollToBottom()
  }
)
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