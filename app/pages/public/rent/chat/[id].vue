<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 relative transition-colors duration-250">
    <!-- Ambient subtle background decorative blurs -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/5 animate-pulse" style="animation-duration: 8s" />
      <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-600/5 animate-pulse" style="animation-duration: 12s; animation-delay: 1.5s" />
    </div>

    <header
      v-if="currentPartner"
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
              src="/png/upload-profile.png"
              alt="Profile Image"
              class="w-10 h-10 rounded-xl object-cover border border-slate-200/60 dark:border-slate-800 shadow-sm"
              :class="currentPartner.sessionStatus === 'finished' ? 'opacity-60 grayscale-[35%]' : ''"
            >
            <span
              v-if="currentPartner.sessionStatus === 'finished'"
              class="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 border border-white dark:border-slate-900 text-white text-[8px] font-bold"
            >
              <i class="pi pi-times" />
            </span>
            <span
              v-else-if="currentPartner.status === 'online'"
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"
            />
            <span
              v-else-if="currentPartner.status === 'idle'"
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500 dark:border-slate-900"
            />
          </div>

          <!-- Partner Name & Category -->
          <div class="min-w-0 leading-tight">
            <div class="flex items-center gap-1.5">
              <p class="font-bold text-slate-850 dark:text-slate-50 text-sm md:text-base truncate">
                {{ currentPartner.nickname }}
              </p>
             
            </div>
            
            <p
              v-if="currentPartner.sessionStatus === 'finished'"
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

          <!-- Message bubbles -->
          <div
            v-for="chat in messages"
            :key="chat.id"
            class="group flex w-full"
            :class="chat.sender === 'self' ? 'justify-end' : 'justify-start'"
          >
            <div class="flex min-w-0 max-w-[85%] flex-col sm:max-w-[75%] lg:max-w-[60%]">
              <div
                class="flex items-end gap-2 min-w-0"
                :class="chat.sender === 'self' ? 'flex-row' : 'flex-row-reverse'"
              >
                <!-- Message Bubble -->
                <div
                  class="flex flex-col gap-1 px-4 py-2.5 rounded-2xl shadow-sm max-w-full min-w-0 transition-all duration-200"
                  :class="
                    chat.sender === 'self'
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
                      :class="chat.sender === 'self' ? 'text-white/75' : 'text-slate-400 dark:text-slate-500'"
                    >
                      {{ dayjs(chat.createdAt).format("hh:mm A") }}
                    </p>
                    
                    <template v-if="chat.sender === 'self'">
                      <i class="text-[9px] text-emerald-300 dark:text-emerald-400 pi pi-check-circle" />
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Simulated Typing Indicator -->
          <Transition name="fade">
            <div v-if="isTyping && currentPartner.sessionStatus !== 'finished'" class="flex justify-start">
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
            <div v-if="currentPartner.sessionStatus === 'finished'" class="text-center my-6 select-none">
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
            <div v-if="currentPartner.sessionStatus === 'pending'" class="text-center my-6 select-none mx-auto max-w-md px-4">
              <div class="inline-flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border border-amber-200 bg-amber-50/20 dark:border-amber-950/20 dark:bg-amber-950/10 shadow-sm">
                <span class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-500 shadow-inner animate-pulse">
                  <i class="pi pi-clock text-sm" />
                </span>
                <span class="text-xs font-bold text-slate-750 dark:text-slate-200">รอการตอบรับ/อนุมัติจากผู้ให้บริการ</span>
                <p class="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed max-w-xs">
                  ส่งคำขอเช่าคุยจำนวน {{ currentPartner.maxDurationMinutes }} นาทีเรียบร้อยแล้ว กรุณารอผู้ให้บริการตอบรับ หรือคลิกตรวจสอบสถานะ / จำลองอนุมัติเพื่อทดสอบ
                </p>
                <div class="flex gap-2 w-full mt-2.5 justify-center">
                  <Button
                    label="ตรวจสอบสถานะ"
                    icon="pi pi-refresh"
                    pt:label:class="font-semibold text-xs text-slate-700 dark:text-slate-200"
                    pt:root:class="border border-slate-300 dark:border-slate-700 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition rounded-xl bg-transparent"
                    @click="checkApprovalStatus" />
                  <Button
                    label="อนุมัติคำขอ (จำลอง)"
                    icon="pi pi-check"
                    pt:label:class="font-semibold text-xs text-white"
                    pt:root:class="bg-gradient-primary border-none px-4 py-2 text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition rounded-xl"
                    @click="simulateApproval" />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Chat Room Input Container -->
      <div class="chat-room-input-container border-t border-slate-200/80 bg-white/95 px-4 pt-3 dark:border-slate-850 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-250">
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
            <i class="pi pi-send text-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useToast } from 'primevue/usetoast'
import Button from '~/volt/Button.vue'

definePageMeta({ layout: "chat-rent", title: "แชท" });

const route = useRoute()
const partnerId = computed(() => Number(route.params.id))

const chatScrollContainer = ref<HTMLElement | null>(null)
const userMessageText = ref('')
const isTyping = ref(false)
const toast = useToast()

const remainingSeconds = ref(0)
let timerInterval: any = null

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

const simulateApproval = (): void => {
  if (!currentPartner.value) return
  currentPartner.value.sessionStatus = 'active'
  currentPartner.value.lastMessageText = 'ผู้ให้บริการตอบรับคำขอคุยแล้ว'
  currentPartner.value.lastMessageCreatedAt = new Date()
  messages.value.push({
    id: Date.now(),
    sender: 'partner',
    text: `🔔 ระบบ: ผู้ให้บริการได้อนุมัติคำขอเช่าคุยแล้วเป็นเวลา ${currentPartner.value.maxDurationMinutes} นาที เริ่มต้นเซสชันคุยของคุณได้เลยค่ะ!`,
    createdAt: new Date()
  })
  void scrollToBottom()
  
  toast.add({
    severity: 'success',
    summary: 'อนุมัติเรียบร้อย',
    detail: 'ผู้ให้บริการอนุมัติคำขอเช่าคุยแล้ว',
    life: 3000
  })
}

const checkApprovalStatus = (): void => {
  toast.add({
    severity: 'info',
    summary: 'ตรวจสอบสถานะ',
    detail: 'กำลังตรวจสอบสถานะกับเซิร์ฟเวอร์...',
    life: 1500
  })
  
  setTimeout((): void => {
    simulateApproval()
  }, 1500)
}

// Use the shared useState from SidebarChat
const conversationsRent = useState<any[]>('conversationsRent', (): any[] => [
  {
    id: 1,
    nickname: 'น้องนุ่น (Smile Partner)',
    username: 'noon_smile',
    profileImg: null,
    status: 'online',
    category: 'ผู้รับฟังที่ดี',
    rating: '4.9',
    rate: '30',
    rateHour: '120',
    lastMessageText: 'ยินดีรับฟังทุกเรื่องเลยค่ะ สบายใจขึ้นไหมคะ?',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    welcomeMessage: 'สวัสดีค่ะพี่ ยินดีต้อนรับนะคะ! วันนี้มีเรื่องอะไรไม่สบายใจ หรืออยากเล่าให้ฟังเป็นพิเศษไหมคะ? นุ่นพร้อมฟังและอยู่เคียงข้างพี่เสมอค่ะ',
    sessionStatus: 'active',
    maxDurationMinutes: 180
  },
  {
    id: 2,
    nickname: 'พี่นัท (Life Coach)',
    username: 'nut_coach',
    profileImg: null,
    status: 'online',
    category: 'ที่ปรึกษา',
    rating: '5.0',
    rate: '30',
    rateHour: '150',
    lastMessageText: 'เรื่องงานลองจัดสรรเวลาแบบใหม่ดูนะครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    welcomeMessage: 'สวัสดีครับ! ยินดีที่ได้คุยกันนะ วันนี้อยากปรึกษาเรื่องอะไรเป็นพิเศษครับ? ไม่ว่าจะเป็นเรื่องงาน ความคิด หรือทิศทางชีวิต พี่พร้อมช่วยซัพพอร์ตครับ',
    sessionStatus: 'active',
    maxDurationMinutes: 120
  },
  {
    id: 3,
    nickname: 'มินนี่ (Gamer Buddy)',
    username: 'minnie_game',
    profileImg: null,
    status: 'idle',
    category: 'เพื่อนเล่นเกม',
    rating: '4.8',
    rate: '40',
    rateHour: '100',
    lastMessageText: 'คืนนี้มาลงแรงค์กันต่อไหมคะ เดี๋ยวซัพพอร์ตให้เอง!',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    welcomeMessage: 'หวัดดีค่า! พร้อมตี้หรือยังคะ? คืนนี้จะเล่นเกมอะไรดี ลุยไปด้วยกันนะ เดี๋ยวหนูแบกเอง (หรือให้พี่แบกดีนะ ฮ่าๆ)',
    sessionStatus: 'finished',
    maxDurationMinutes: 240
  },
  {
    id: 4,
    nickname: 'เจมส์ (Cafe Hopper)',
    username: 'james_cafe',
    profileImg: null,
    status: 'online',
    category: 'เพื่อนเที่ยว',
    rating: '4.9',
    rate: '60',
    rateHour: '130',
    lastMessageText: 'ร้านกาแฟเปิดใหม่แถวอารีย์บรรยากาศดีมากครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 360), 
    welcomeMessage: 'สวัสดีครับพี่! วันนี้อยากหาเพื่อนคุยสไตล์เที่ยวชิลๆ หรือแชร์ร้านคาเฟ่ลับๆ ดีครับ? มีพิกัดเจ๋งๆ แนะนำเพียบเลย!',
    sessionStatus: 'active',
    maxDurationMinutes: 180
  }
])

const currentPartner = computed(() => {
  return conversationsRent.value.find(p => p.id === partnerId.value) || conversationsRent.value[0]
})

const messages = ref<{
  id: number
  sender: 'self' | 'partner'
  text: string
  createdAt: Date
}[]>([])

const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollContainer.value) {
    chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight
  }
}

const initializeMessages = () => {
  const partner = currentPartner.value
  if (!partner) return

  messages.value = [
    {
      id: 101,
      sender: 'partner',
      text: `สวัสดีครับ/ค่ะ ยินดีที่ได้คุยกันในระบบเช่าเพื่อนคุยของ Buddy Hub นะครับ/ค่ะ!`,
      createdAt: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: 102,
      sender: 'self',
      text: 'สวัสดีครับ ยินดีเช่นกันครับ',
      createdAt: new Date(Date.now() - 1000 * 60 * 9)
    },
    {
      id: 103,
      sender: 'partner',
      text: partner.welcomeMessage,
      createdAt: new Date(Date.now() - 1000 * 60 * 8)
    }
  ]

  if (partner.sessionStatus === 'pending') {
    messages.value.push({
      id: 105,
      sender: 'partner',
      text: `สวัสดีค่ะ ฉันได้รับคำขอเช่าคุยจำนวน ${partner.maxDurationMinutes} นาทีของคุณแล้วนะคะ อยู่ระหว่างเตรียมตัวและพิจารณาอนุมัติคำขอค่ะ สแตนด์บายรอสักครู่นะคะ 💖`,
      createdAt: new Date()
    })
  }

  if (partner.sessionStatus === 'finished') {
    messages.value.push({
      id: 104,
      sender: 'partner',
      text: 'เซสชันสนทนานี้สิ้นสุดบริการแล้ว หวังว่าจะได้รับความประทับใจ แล้วพบกันใหม่ในโอกาสถัดไปนะคะ! 💖',
      createdAt: new Date(Date.now() - 1000 * 60 * 1)
    })
  }

  void scrollToBottom()
}

const handleSendMessage = () => {
  if (currentPartner.value?.sessionStatus === 'finished') return

  const text = userMessageText.value.trim()
  if (!text) return

  // Push user message
  messages.value.push({
    id: Date.now(),
    sender: 'self',
    text,
    createdAt: new Date()
  })

  userMessageText.value = ''
  void scrollToBottom()

  // Simulate response delay from companion
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    
    let replyText = 'ขอบคุณที่แวะมาทักทายและคุยกันนะคะ!'
    const partnerIdVal = currentPartner.value?.id
    
    if (partnerIdVal === 1) {
      replyText = `เข้าใจพี่เลยค่ะ การมีเรื่องให้คิดเยอะๆ มันก็เหนื่อยเหมือนกันนะ ถ้ารู้สึกเครียดตรงไหน นุ่นเป็นเซฟโซนคอยซัพพอร์ตพี่ได้เสมอนะคะ สู้ๆ ค่ะ 💖`
    } else if (partnerIdVal === 2) {
      replyText = `นั่นเป็นมุมมองที่เป็นระบบมากครับ การแก้ปัญหาทีละจุดจะทำให้เราเห็นภาพรวมได้ชัดขึ้น ลองลิสต์หัวข้อออกมาก่อนแล้วคุยกันทีละข้อดีไหมครับ พี่นัทจะช่วยแนะแนวให้เองครับ`
    } else if (partnerIdVal === 3) {
      replyText = `โอ้ว เจ๋งเลยพี่! งั้นจองคิวไว้เลย คืนนี้ลุยยาวๆ คีย์บอร์ดพร้อม หูฟังพร้อม ลุยโลดดดด! 🎮✨`
    } else if (partnerIdVal === 4) {
      replyText = `ดีเลยครับพี่! ร้านนั้นมุมถ่ายรูปเยอะและกาแฟคั่วกลางดีมากครับ ไว้ถ้าพี่อยากหาเพื่อนเดินชิลๆ หรือชิมเค้กอร่อยๆ ทักเจมส์มาได้เลยนะฮะ`
    }

    messages.value.push({
      id: Date.now() + 1,
      sender: 'partner',
      text: replyText,
      createdAt: new Date()
    })

    void scrollToBottom()
  }, 1500)
}

const confirmEndChat = () => {
  if (confirm('คุณต้องการจบเซสชันการคุยใช่หรือไม่? เมื่อจบแล้วจะไม่สามารถส่งข้อความได้อีก')) {
    const partner = conversationsRent.value.find(p => p.id === partnerId.value)
    if (partner) {
      partner.sessionStatus = 'finished'
      messages.value.push({
        id: Date.now(),
        sender: 'partner',
        text: 'เซสชันสิ้นสุดลงแล้ว ขอบคุณสำหรับเวลาที่ร่วมสนทนากันนะคะ/ครับ! หากต้องการบริการเพิ่มเติม สามารถเลือกเพื่อนคุยคนใหม่ได้เลยค่ะ 💖',
        createdAt: new Date()
      })
      void scrollToBottom()
    }
  }
}

const extendSessionTime = () => {
  const partner = conversationsRent.value.find(p => p.id === partnerId.value)
  if (partner) {
    partner.sessionStatus = 'active'
    messages.value.push({
      id: Date.now(),
      sender: 'partner',
      text: `🔔 ระบบ: ขยายเวลาการสนทนาเรียบร้อยแล้ว ได้รับเวลาสูงสุดจากเพื่อนคุย ${partner.maxDurationMinutes} นาที สามารถพิมพ์ข้อความต่อได้เลยค่ะ/ครับ`,
      createdAt: new Date()
    })
    void scrollToBottom()
  }
}

const showStickerAlert = () => {
  alert('ฟีเจอร์ส่งรูปภาพ/สติกเกอร์เป็นส่วนหนึ่งของดีไซน์ mockup หน้าแชทจริง')
}

// Watch route parameter changes to re-initialize
watch(
  () => partnerId.value,
  () => {
    initializeMessages()
  },
  { immediate: true }
)

// Watch sessionStatus or partner ID changes to trigger countdown
watch(
  [() => currentPartner.value?.id, () => currentPartner.value?.sessionStatus],
  (): void => {
    if (currentPartner.value?.sessionStatus === 'active') {
      startCountdown()
    } else {
      if (timerInterval) clearInterval(timerInterval)
    }
  },
  { immediate: true }
)

onMounted(() => {
  initializeMessages()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
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