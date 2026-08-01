<template>
  <div
    class="call-page relative flex h-[var(--app-height,100dvh)] w-full flex-col items-center justify-between overflow-hidden">
    <!-- ─── Background: blurred avatar wallpaper ─── -->
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10">
      <img
        v-if="partnerProfileImg"
        :src="partnerProfileImg"
        alt=""
        class="h-full w-full object-cover"
        draggable="false">
      <div
        v-else
        class="h-full w-full bg-gradient-to-br from-indigo-600 via-violet-700 to-sky-500" />
      <!-- Dark blur overlay -->
      <div class="absolute inset-0 bg-slate-950/65 backdrop-blur-2xl" />
    </div>

    <!-- ─── Animated pulse rings (RINGING state) ─── -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
      <div
        v-if="callStatus === CallStatusEnum.RINGING"
        class="absolute h-80 w-80 rounded-full border border-white/8 animate-ping"
        style="animation-duration: 2.4s" />
      <div
        v-if="callStatus === CallStatusEnum.RINGING"
        class="absolute h-60 w-60 rounded-full border border-white/10 animate-ping"
        style="animation-duration: 1.9s; animation-delay: 0.5s" />
      <div
        v-if="callStatus === CallStatusEnum.RINGING"
        class="absolute h-44 w-44 rounded-full border border-white/15 animate-ping"
        style="animation-duration: 1.4s; animation-delay: 0.9s" />
    </div>

    <!-- ─── Ambient glow blobs ─── -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"
        style="animation-duration: 6s" />
      <div
        class="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl animate-pulse"
        style="animation-duration: 8s; animation-delay: 2s" />
    </div>

    <!-- ─── Header ─── -->
    <header class="z-10 flex w-full items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-2">
      <ButtonBack
        :use-history-fallback="true"
        class="text-white/80 hover:text-white"
        icon="mdi:arrow-left" />

      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 select-none">
        Voice Call
      </span>

      <div class="w-10" />
    </header>

    <!-- ─── Partner Avatar (centre stage) ─── -->
    <main class="z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <!-- Glow ring + Avatar -->
      <div class="relative flex items-center justify-center">
        <!-- Outer glow ring -->
        <div
          :class="[
            'absolute rounded-full transition-all duration-700',
            callStatus === CallStatusEnum.ACCEPTED
              ? 'h-52 w-52 bg-gradient-to-br from-teal-400/30 via-indigo-400/20 to-violet-500/30 animate-pulse'
              : 'h-52 w-52 bg-white/5'
          ]"
          style="animation-duration: 2.5s" />

        <!-- Inner ring (glass effect) -->
        <div class="absolute h-40 w-40 rounded-full ring-4 ring-white/15" />

        <!-- Avatar image/fallback -->
        <div class="relative z-10 h-36 w-36 overflow-hidden rounded-full shadow-2xl">
          <img
            v-if="partnerProfileImg"
            :alt="partnerName"
            :src="partnerProfileImg"
            class="h-full w-full object-cover">
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-5xl font-bold text-white select-none">
            {{ partnerInitial }}
          </div>
        </div>

        <!-- Online dot (ACCEPTED) -->
        <span
          v-if="callStatus === CallStatusEnum.ACCEPTED"
          class="absolute bottom-2.5 right-2.5 z-20 h-5 w-5 rounded-full border-[3px] border-slate-950 bg-emerald-400 shadow animate-pulse"
          style="animation-duration: 2s" />
      </div>

      <!-- Partner name & username -->
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
          {{ partnerName }}
        </h1>
        <p class="mt-1 text-sm text-white/50">
          @{{ partnerUsername }}
        </p>
      </div>

      <!-- Status pill -->
      <div
        :class="statusPillClass"
        class="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-md transition-all duration-500 select-none">
        <span
          v-if="callStatus === CallStatusEnum.RINGING"
          class="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
        <span
          v-else-if="callStatus === CallStatusEnum.ACCEPTED"
          class="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
        <span
          v-else
          class="h-2 w-2 rounded-full bg-white/30" />
        {{ statusText }}
      </div>

      <!-- Duration timer -->
      <Transition name="fade-up">
        <p
          v-if="callStatus === CallStatusEnum.ACCEPTED"
          class="font-mono text-3xl font-bold tracking-[0.2em] text-white drop-shadow-lg select-none">
          {{ formattedDuration }}
        </p>
      </Transition>
    </main>

    <!-- ─── Footer: My Avatar + Controls ─── -->
    <footer class="z-10 flex w-full flex-col items-center gap-5 px-6 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
      <!-- My small floating avatar card -->
      <div
        class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md shadow-lg">
        <div class="relative h-12 w-12 overflow-hidden rounded-xl shadow-md ring-2 ring-white/20">
          <img
            v-if="myProfileImg"
            :src="myProfileImg"
            alt="ฉัน"
            class="h-full w-full object-cover">
          <div
            v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white select-none">
            {{ myInitial }}
          </div>
        </div>
        <div class="text-left">
          <p class="text-sm font-semibold leading-tight text-white">
            {{ myName }}
          </p>
          <p class="text-[11px] text-white/40">
            คุณ (ฉัน)
          </p>
        </div>

        <!-- Mic active indicator -->
        <div
          :class="isMuted ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'"
          class="ml-2 flex h-7 w-7 items-center justify-center rounded-full">
          <Icon
            :name="isMuted ? 'mdi:microphone-off' : 'mdi:microphone'"
            size="14px" />
        </div>
      </div>

      <!-- Control buttons row -->
      <div class="flex items-end justify-center gap-5">
        <!-- Mute -->
        <div class="flex flex-col items-center gap-2">
          <button
            id="call-btn-mute"
            :aria-label="isMuted ? 'เปิดไมค์' : 'ปิดไมค์'"
            :class="[
              'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 active:scale-95',
              isMuted
                ? 'bg-white text-slate-900 shadow-lg shadow-white/20'
                : 'border border-white/20 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
            ]"
            type="button"
            @click="toggleMute">
            <Icon
              :name="isMuted ? 'mdi:microphone-off' : 'mdi:microphone'"
              size="22px" />
          </button>
          <span class="text-[10px] font-medium text-white/50 select-none">
            {{ isMuted ? 'เปิดไมค์' : 'ปิดไมค์' }}
          </span>
        </div>

        <!-- End call (prominent red) -->
        <div class="flex flex-col items-center gap-2">
          <button
            id="call-btn-end"
            aria-label="วางสาย"
            class="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-2xl shadow-red-500/50 ring-4 ring-red-500/20 transition-all duration-200 hover:bg-red-600 active:scale-95"
            type="button"
            @click="handleEndCall">
            <Icon
              name="mdi:phone-hangup"
              size="30px" />
          </button>
          <span class="text-[10px] font-medium text-white/50 select-none">
            วางสาย
          </span>
        </div>

        <!-- Speaker -->
        <div class="flex flex-col items-center gap-2">
          <button
            id="call-btn-speaker"
            :aria-label="isSpeakerOn ? 'ปิดลำโพง' : 'เปิดลำโพง'"
            :class="[
              'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 active:scale-95',
              isSpeakerOn
                ? 'bg-white text-slate-900 shadow-lg shadow-white/20'
                : 'border border-white/20 bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
            ]"
            type="button"
            @click="toggleSpeaker">
            <Icon
              :name="isSpeakerOn ? 'mdi:volume-high' : 'mdi:volume-medium'"
              size="22px" />
          </button>
          <span class="text-[10px] font-medium text-white/50 select-none">
            {{ isSpeakerOn ? 'ลำโพงเปิด' : 'ลำโพง' }}
          </span>
        </div>
      </div>
    </footer>
    <audio
      ref="remoteAudioRef"
      autoplay />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CallStatusEnum } from '~/models/enums/Call.enum'
import type { IInitiateCallData } from '~/models/response/CallRes.model'
import { useAuthStore } from '~/stores/Auth'
import { useCallStore } from '~/stores/Call'

definePageMeta({ layout: 'fullscreen' })

useHead({
  title: 'สาย - BuddyHub',
  meta: [{ name: 'description', content: 'หน้าโทรด้วยเสียง BuddyHub Voice Call' }]
})

// ─── Env / store ──────────────────────────────────────────────────────────────
const authStore = useAuthStore()
const callStore = useCallStore()
const { callStatus, callData, remoteOffer, remoteAnswer, remoteIceCandidates } = storeToRefs(callStore)
const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

// ─── Route: callData comes as a JSON query param ──────────────────────────────
const route = useRoute()
const router = useRouter()
const { $handleLoading, $ws } = useNuxtApp()

// ─── WebRTC state ─────────────────────────────────────────────────────────────
const remoteAudioRef = ref<HTMLAudioElement | null>(null)
const remoteStream = ref<MediaStream | null>(null)
let localStream: MediaStream | null = null
let peerConnection: RTCPeerConnection | null = null
let isWebrtcInitialized = false
let offerInterval: ReturnType<typeof setInterval> | null = null

const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
]

const statusText = computed((): string => {
  if (!callStatus.value) return ''
  const map: Record<CallStatusEnum, string> = {
    [CallStatusEnum.RINGING]: 'กำลังโทรออก…',
    [CallStatusEnum.ACCEPTED]: 'กำลังสนทนา',
    [CallStatusEnum.ENDED]: 'สายหมด',
    [CallStatusEnum.MISSED]: 'ไม่รับสาย'
  }
  return map[callStatus.value]
})

const statusPillClass = computed((): string => {
  if (!callStatus.value) return ''
  const map: Record<CallStatusEnum, string> = {
    [CallStatusEnum.RINGING]: 'border-amber-400/30 bg-amber-400/15 text-amber-200',
    [CallStatusEnum.ACCEPTED]: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    [CallStatusEnum.ENDED]: 'border-white/10 bg-white/10 text-white/50',
    [CallStatusEnum.MISSED]: 'border-red-400/30 bg-red-400/15 text-red-300'
  }
  return map[callStatus.value]
})

// ─── Partner info ─────────────────────────────────────────────────────────────
const isCallerMe = computed((): boolean => callData.value?.callerId === authStore.user.id)

const partnerUsername = computed((): string => {
  if (!callData.value) return 'buddy_user'
  return isCallerMe.value ? callData.value.calleeUsername : callData.value.callerUsername
})

const partnerNickname = computed((): string => {
  if (!callData.value) return ''
  return isCallerMe.value ? callData.value.calleeNickname : callData.value.callerNickname
})

const partnerName = computed((): string => partnerNickname.value || partnerUsername.value || 'ไม่ทราบชื่อ')

const partnerProfileImgRaw = computed((): string => {
  if (!callData.value) return ''
  return isCallerMe.value ? callData.value.calleeProfileImg : callData.value.callerProfileImg
})

const partnerProfileImg = computed((): string => {
  const raw = partnerProfileImgRaw.value
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return imageBaseUrl + raw
})

const partnerInitial = computed((): string => (partnerName.value?.[0] ?? '?').toUpperCase())

// ─── My info ──────────────────────────────────────────────────────────────────
const myProfileImgRaw = computed((): string => authStore.user.profileImg ?? '')
const myProfileImg = computed((): string => {
  const raw = myProfileImgRaw.value
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return imageBaseUrl + raw
})
const myName = computed((): string => authStore.user.username || 'ฉัน')
const myInitial = computed((): string => (myName.value?.[0] ?? 'M').toUpperCase())

// ─── Controls ─────────────────────────────────────────────────────────────────
const isMuted = ref(false)
const isSpeakerOn = ref(false)

function toggleMute (): void {
  isMuted.value = !isMuted.value
}

function toggleSpeaker (): void {
  isSpeakerOn.value = !isSpeakerOn.value
}

// ─── Duration timer ───────────────────────────────────────────────────────────
const elapsedSeconds = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const formattedDuration = computed((): string => {
  const h = Math.floor(elapsedSeconds.value / 3600)
  const m = Math.floor((elapsedSeconds.value % 3600) / 60)
  const s = elapsedSeconds.value % 60
  if (h > 0) {
    return [h, m, s].map((v: number): string => String(v).padStart(2, '0')).join(':')
  }
  return [m, s].map((v: number): string => String(v).padStart(2, '0')).join(':')
})

function startTimer (): void {
  stopTimer()
  elapsedSeconds.value = 0
  timer = setInterval((): void => {
    elapsedSeconds.value += 1
  }, 1000)
}

function stopTimer (): void {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

// ─── WebRTC functions ─────────────────────────────────────────────────────────
async function initPeerConnection (): Promise<void> {
  peerConnection = new RTCPeerConnection({ iceServers })

  peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent): void => {
    if (event.candidate && callData.value) {
      const socket = $ws()
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          event: 'call:ice-candidate',
          data: {
            callId: callData.value.id,
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid,
              sdpMLineIndex: event.candidate.sdpMLineIndex
            }
          }
        }))
      }
    }
  }

  peerConnection.ontrack = (event: RTCTrackEvent): void => {
    if (event.streams && event.streams[0]) {
      remoteStream.value = event.streams[0]
      if (remoteAudioRef.value) {
        remoteAudioRef.value.srcObject = event.streams[0]
      }
    }
  }

  if (localStream) {
    localStream.getTracks().forEach((track: MediaStreamTrack): void => {
      if (peerConnection && localStream) {
        peerConnection.addTrack(track, localStream)
      }
    })
  }
}

async function startCallFlow (): Promise<void> {
  if (isWebrtcInitialized) return
  isWebrtcInitialized = true

  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    if (isMuted.value && localStream) {
      localStream.getAudioTracks().forEach((track: MediaStreamTrack): void => {
        track.enabled = false
      })
    }
  } catch (err) {
    console.error('Failed to get local stream:', err)
  }

  await initPeerConnection()

  if (isCallerMe.value) {
    const sendOffer = async (): Promise<void> => {
      if (!peerConnection) return
      const isConnected = peerConnection.connectionState === 'connected'
        || peerConnection.iceConnectionState === 'connected'
      if (isConnected) {
        if (offerInterval) {
          clearInterval(offerInterval)
          offerInterval = null
        }
        return
      }

      try {
        const offer = await peerConnection.createOffer()
        await peerConnection.setLocalDescription(offer)

        const socket = $ws()
        if (socket && socket.readyState === WebSocket.OPEN && callData.value) {
          socket.send(JSON.stringify({
            event: 'call:offer',
            data: {
              callId: callData.value.id,
              sdp: { type: offer.type, sdp: offer.sdp }
            }
          }))
        }
      } catch (err: any) {
        console.error('Failed to create/send offer:', err)
      }
    }

    void sendOffer()

    offerInterval = setInterval((): void => {
      void sendOffer()
    }, 3000)
  } else {
    if (remoteOffer.value) {
      await handleIncomingOffer(remoteOffer.value)
    }
  }
}

async function handleIncomingOffer (offer: { sdp: { type: string, sdp: string }, senderId: number }): Promise<void> {
  if (!peerConnection) return
  try {
    await peerConnection.setRemoteDescription({
      type: offer.sdp.type as RTCSdpType,
      sdp: offer.sdp.sdp
    })
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    const socket = $ws()
    if (socket && socket.readyState === WebSocket.OPEN && callData.value) {
      socket.send(JSON.stringify({
        event: 'call:answer',
        data: {
          callId: callData.value.id,
          sdp: { type: answer.type, sdp: answer.sdp }
        }
      }))
    }

    await processQueuedIceCandidates()
  } catch (err) {
    console.error('Failed to handle incoming offer:', err)
  }
}

async function handleIncomingAnswer (answer: { sdp: { type: string, sdp: string }, senderId: number }): Promise<void> {
  if (!peerConnection) return
  try {
    await peerConnection.setRemoteDescription({
      type: answer.sdp.type as RTCSdpType,
      sdp: answer.sdp.sdp
    })
    await processQueuedIceCandidates()
  } catch (err) {
    console.error('Failed to handle incoming answer:', err)
  }
}

async function processQueuedIceCandidates (): Promise<void> {
  if (!peerConnection || !peerConnection.remoteDescription) return
  for (const item of remoteIceCandidates.value) {
    if (item.senderId !== authStore.user.id) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(item.candidate))
      } catch (err) {
        console.error('Error adding ICE candidate:', err)
      }
    }
  }
}

function cleanupWebRTC (): void {
  stopTimer()

  if (offerInterval) {
    clearInterval(offerInterval)
    offerInterval = null
  }

  if (peerConnection) {
    peerConnection.ontrack = null
    peerConnection.onicecandidate = null
    try {
      peerConnection.close()
    } catch (err: any) {
      console.error('Error closing peer connection:', err)
    }
    peerConnection = null
  }

  if (localStream) {
    localStream.getTracks().forEach((track: MediaStreamTrack): void => {
      try {
        track.stop()
      } catch (err) {
        console.error('Error stopping track:', err)
      }
    })
    localStream = null
  }

  if (remoteAudioRef.value) {
    remoteAudioRef.value.srcObject = null
  }

  remoteStream.value = null
  isWebrtcInitialized = false
}

// ─── End call ─────────────────────────────────────────────────────────────────
function handleEndCall (): void {
  $handleLoading((): Promise<void> => callStore.endCall(callData.value?.id ?? 0))
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(isMuted, (val: boolean): void => {
  if (localStream) {
    localStream.getAudioTracks().forEach((track: MediaStreamTrack): void => {
      track.enabled = !val
    })
  }
})

watch(remoteOffer, async (newOffer: { sdp: { type: string, sdp: string }, senderId: number } | null): Promise<void> => {
  if (newOffer && !isCallerMe.value && peerConnection) {
    await handleIncomingOffer(newOffer)
  }
})

watch(remoteAnswer, async (newAnswer: { sdp: { type: string, sdp: string }, senderId: number } | null): Promise<void> => {
  if (newAnswer && isCallerMe.value && peerConnection) {
    await handleIncomingAnswer(newAnswer)
  }
})

watch(remoteIceCandidates, async (candidates: Array<{
  candidate: {
    candidate: string
    sdpMid?: string | null
    sdpMLineIndex?: number | null
  }
  senderId: number
}>): Promise<void> => {
  if (!peerConnection || !peerConnection.remoteDescription) return
  for (const item of candidates) {
    if (item.senderId !== authStore.user.id) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(item.candidate))
      } catch (err) {
        console.error('Error adding ICE candidate:', err)
      }
    }
  }
}, { deep: true })

let waitCallingAudio: HTMLAudioElement | null = null

function playWaitCallingSound (): void {
  if (typeof window === 'undefined') return
  stopWaitCallingSound()
  waitCallingAudio = new Audio('https://res.cloudinary.com/epusyfzi/video/upload/v1785598969/waitcalling_x7rbhg.mp3')
  waitCallingAudio.loop = true
  waitCallingAudio.play().catch((err: any): void => {
    console.warn('Autoplay prevented playing waitcalling ringtone:', err)
  })
}

function stopWaitCallingSound (): void {
  if (waitCallingAudio) {
    waitCallingAudio.pause()
    waitCallingAudio = null
  }
}

watch(callStatus, (newStatus: CallStatusEnum | null): void => {
  if (newStatus === CallStatusEnum.RINGING) {
    playWaitCallingSound()
  } else if (newStatus === CallStatusEnum.ACCEPTED) {
    stopWaitCallingSound()
    startTimer()
    void startCallFlow()
  } else if (
    newStatus === CallStatusEnum.ENDED
    || newStatus === CallStatusEnum.MISSED
  ) {
    stopWaitCallingSound()
    cleanupWebRTC()
    setTimeout((): void => {
      if (typeof window !== 'undefined' && window.opener) {
        window.close()
      } else {
        router.back()
      }
    }, 1000)
  }
}, { immediate: true })

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted((): void => {
  if (!callData.value) {
    try {
      const raw = route.query.callData as string | undefined
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw)) as IInitiateCallData
        callStore.setCallData(parsed)
        const isCaller = parsed.callerId === authStore.user.id
        if (parsed.status === 'ACCEPTED' || !isCaller) {
          callStore.setCallStatus(CallStatusEnum.ACCEPTED)
        } else {
          callStore.setCallStatus(CallStatusEnum.RINGING)
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  if (callData.value && callData.value.callerId !== authStore.user.id) {
    callStore.setCallStatus(CallStatusEnum.ACCEPTED)
  }

  if (!callData.value) {
    // dev fallback: simulate ringing → accepted
    setTimeout((): void => {
      callStore.setCallStatus(CallStatusEnum.ACCEPTED)
    }, 3000)
    return
  }

  if (callStatus.value === CallStatusEnum.ACCEPTED) {
    startTimer()
    void startCallFlow()
  }
})

onUnmounted((): void => {
  cleanupWebRTC()
  stopWaitCallingSound()
})
</script>

<style scoped>
.call-page {
  background: #080c14;
}

/* Fade-up transition for the timer */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.35s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
