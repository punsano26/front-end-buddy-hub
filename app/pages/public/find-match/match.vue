<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto w-full">
    <Card class="border border-surface-200 dark:border-surface-700 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-surface-900 transition-all hover:shadow-lg">
      <template #content>
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 p-2 md:p-4">
          <div class="flex gap-4 items-center w-full md:w-auto">
            <div class="relative shrink-0">
              <SecondaryButton size="large" icon="pi pi-user" aria-label="User Avatar" rounded class="w-16! h-16! flex items-center justify-center text-2xl shadow-sm bg-surface-100 dark:bg-surface-800" />
               <span class="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-surface-900 rounded-full"></span>
            </div>           
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-lg font-semibold text-surface-900 dark:text-surface-0 m-0 leading-tight">
                  ผู้ใช้งานคนนี้คือเพื่อนใหม่ของคุณ
                </p>
                <Tag value="Private" severity="secondary" rounded class="text-xs px-2.5 py-1 font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300" />
              </div>
              <div class="flex flex-wrap items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <span class="hidden sm:inline text-surface-300 dark:text-surface-600">&bull;</span>
                <span class="text-xs sm:text-sm">ข้อมูลถูกซ่อนเพื่อความเป็นส่วนตัว</span>
              </div>
            </div>
          </div>        
          <div class="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-surface-100 dark:border-surface-800 pt-5 md:pt-0 mt-2 md:mt-0">
            <template v-if="isAccepted">
              <Button
                disabled
                size="small"
                label="เป็นเพื่อนกันแล้ว"
                icon="pi pi-check"
                class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm"
              />
            </template>
            <template v-else-if="isIncomingRequest && !isRejected">
              <Button
                :disabled="isSubmitting"
                @click="acceptFriendRequest"
                size="small"
                label="ยอมรับเพื่อน"
                icon="pi pi-check"
                class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm bg-linear-to-r from-emerald-500 to-green-600 border-none text-white enabled:hover:from-emerald-600 enabled:hover:to-green-700 active:from-emerald-400 active:to-green-500"
              />
              <Button
                :disabled="isSubmitting"
                @click="rejectFriendRequest"
                size="small"
                label="ปฏิเสธ"
                icon="pi pi-times"
                class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm bg-linear-to-r from-red-500 to-rose-600 border-none text-white enabled:hover:from-red-600 enabled:hover:to-rose-700 active:from-red-400 active:to-rose-500"
              />
            </template>
            <template v-else>
              <Button
                :disabled="isFriendRequestSent || isSubmitting"
                @click="sendAFriendSessionRequest"
                size="small"
                :label="isFriendRequestSent ? 'ส่งคำขอแล้ว' : 'เพิ่มเพื่อน'"
                :icon="isFriendRequestSent ? 'pi pi-check' : 'pi pi-user-plus'"
                class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm"
              />
            </template>
            <Button size="small" label="รายงาน" icon="pi pi-flag" severity="secondary" outlined class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm" />
            <Button @click="onNavigateBack" size="small" text icon="pi pi-times" severity="secondary" class="hidden md:inline-flex w-10! h-10! p-0 items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors" aria-label="Close" />
          </div>
        </div>
      </template>
    </Card>
    <SpaceChat :messages="sessionMessages" @send-message="sendMessageSessionMatch" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import SpaceChat, { type IMatchMessage } from '~/components/match/SpaceChat.vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { MatchEvent } from '~/models/enums/Match.enum'
import type { ISendASessionMessagePayload } from '~/models/request/MatchReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { ISendASessionMessageData } from '~/models/response/MatchRes.model'
import FriendProvider, { type IFriendProvider } from '~/resource/provider/Friend.provider'
import MatchProvider, { type IMatchProvider } from '~/resource/provider/Match.provider'
import { useAuthStore } from '~/stores/Auth'
import { useFriendStore } from '~/stores/Friend'
import { useMatchStore } from '~/stores/Match'

definePageMeta({
  layout: 'default'
})

const matchService: IMatchProvider = new MatchProvider()
const friendService: IFriendProvider = new FriendProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const matchStore = useMatchStore()
const friendStore = useFriendStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
type IMatchMessageEntry = IMatchMessage & { senderId?: number }
const sessionMessages = ref<IMatchMessageEntry[]>([])
const isFriendRequestSent = ref(false)
const isSubmitting = ref(false)
const isAccepted = ref(false)
const isRejected = ref(false)

const sessionId = computed<TBaseParamsId>(() => {
  return getSessionIdFromEvent(matchStore.getLastEventByType(MatchEvent.PERSISTED)?.data)
    ?? getSessionIdFromEvent(matchStore.getLastEventByType(MatchEvent.FOUND)?.data)
    ?? toSessionId(route.params.sessionId ?? route.query.sessionId)
})

const isIncomingRequest = computed(() => {
  const socketEvent = matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)
  if (!socketEvent) return false
  const currentUserId = authStore.user?.id
  if (!currentUserId) return false

  const currentSessionId = sessionId.value
  const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
  if (currentSessionId && incomingSessionId && incomingSessionId !== currentSessionId) return false

  if (socketEvent.data && typeof socketEvent.data === 'object') {
    const data = socketEvent.data as any
    const requesterId = typeof data.requesterId === 'number' ? data.requesterId : null
    const receiverId = typeof data.receiverId === 'number' ? data.receiverId : null

    if (receiverId && receiverId === currentUserId) return true
    if (requesterId && requesterId === currentUserId) return false

    const reqId = data.requesterId || data.senderId || data.userId
    if (reqId === currentUserId) return false
  }

  return true
})

const incomingRequesterId = computed<number | null>(() => {
  const currentUserId = authStore.user?.id
  const socketEvent = matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)
  if (!currentUserId || !socketEvent?.data || typeof socketEvent.data !== 'object') return null

  const data = socketEvent.data as any
  const requesterId = typeof data.requesterId === 'number' ? data.requesterId : null
  const receiverId = typeof data.receiverId === 'number' ? data.receiverId : null

  if (requesterId && receiverId === currentUserId) return requesterId
  return null
})

function findPartnerIdFromAnywhere (value: unknown): number | null {
  if (!value || typeof value !== 'object') return null
  const data = value as any

  const currentUserId = authStore.user?.id

  // 1. Direct fields: partnerId, friendId, requesterId, receiverId, senderId, userId (exclude 'id' as it represents record/request/session ID, not user ID)
  const directFields = ['partnerId', 'friendId', 'requesterId', 'receiverId', 'senderId', 'userId']
  for (const field of directFields) {
    const val = data[field]
    if (typeof val === 'number' && val !== currentUserId) {
      return val
    }
  }

  // 2. Arrays: e.g. users array, userIds array
  if (Array.isArray(data.users)) {
    for (const u of data.users) {
      if (u && typeof u === 'object') {
        const id = u.id || u.userId
        if (typeof id === 'number' && id !== currentUserId) {
          return id
        }
      } else if (typeof u === 'number' && u !== currentUserId) {
        return u
      }
    }
  }

  if (Array.isArray(data.userIds)) {
    const id = data.userIds.find((u: any) => typeof u === 'number' && u !== currentUserId)
    if (typeof id === 'number') return id
  }

  // 3. Nested objects: session, user, partner, requester, receiver, sender
  const nestedObjects = ['session', 'user', 'partner', 'requester', 'receiver', 'sender']
  for (const objName of nestedObjects) {
    const nested = data[objName]
    if (nested && typeof nested === 'object') {
      const id = findPartnerIdFromAnywhere(nested)
      if (id !== null) return id
    }
  }

  return null
}

const partnerUserId = computed<number | null>(() => {
  const fromFriendReq = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)?.data)
  if (fromFriendReq) return fromFriendReq

  const fromPersisted = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.PERSISTED)?.data)
  if (fromPersisted) return fromPersisted

  const fromFound = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.FOUND)?.data)
  if (fromFound) return fromFound

  const partnerMsg = sessionMessages.value.find(msg => !msg.isOwn && typeof msg.senderId === 'number')
  if (partnerMsg?.senderId) return partnerMsg.senderId

  return null
})

function isRecord (value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

interface ISessionMessageLike {
  id: number | string
  text: string
  sendAt?: string
  createdAt?: string
  senderId?: number
  isOwn?: boolean
}

function isSessionMessageLike (value: unknown): value is ISessionMessageLike {
  if (!isRecord(value)) return false
  const id = value.id
  const sendAt = (value as Record<string, unknown>).sendAt
  const createdAt = (value as Record<string, unknown>).createdAt

  return (typeof id === 'number' || typeof id === 'string')
    && typeof value.text === 'string'
    && (typeof sendAt === 'string' || typeof createdAt === 'string')
}

function normalizeSessionMessage (message: ISessionMessageLike): ISendASessionMessageData {
  const sendAt = typeof message.sendAt === 'string'
    ? message.sendAt
    : typeof message.createdAt === 'string'
      ? message.createdAt
      : new Date().toISOString()

  return {
    id: message.id,
    text: message.text,
    sendAt,
    senderId: message.senderId,
    isOwn: message.isOwn
  }
}

function extractSessionMessageFromSocket (value: unknown): ISendASessionMessageData | null {
  if (isSessionMessageLike(value)) return normalizeSessionMessage(value)
  if (!isRecord(value)) return null

  const directMessage = (value as Record<string, unknown>).message
  if (isSessionMessageLike(directMessage)) return normalizeSessionMessage(directMessage)

  const directData = (value as Record<string, unknown>).data
  if (isSessionMessageLike(directData)) return normalizeSessionMessage(directData)

  return null
}

function tryGetTimeMs (value: string): number | null {
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : null
}

function toSessionId (value: unknown): TBaseParamsId {
  if (Array.isArray(value)) {
    return toSessionId(value[0])
  }

  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && Number.isFinite(value)) return value

  return undefined
}

function getSessionIdFromEvent (value: unknown): TBaseParamsId {
  if (!isRecord(value)) return undefined

  const directSessionId = toSessionId(value.sessionId)
  if (directSessionId) return directSessionId

  const directId = toSessionId(value.id)
  if (directId) return directId

  const session = isRecord(value.session) ? value.session : null
  if (!session) return undefined

  return toSessionId(session.sessionId) ?? toSessionId(session.id)
}

async function onSendMessageSessionMatch (sessionId: TBaseParamsId, message: ISendASessionMessagePayload): Promise<void> {
  if (!sessionId) return
  
  // Optimistic update
  const newMessage: IMatchMessage = {
    id: Date.now(),
    text: message.text,
    sendAt: new Date().toISOString(),
    isOwn: true
  }
  sessionMessages.value.push(newMessage)

  try {
    await matchService.SendASessionMessage(sessionId, message)
    // Optionally re-fetch here if needed, but optimistic update is usually fine
  } catch (error) {
    console.error('Failed to send message:', error)
    // Revert optimistic update on failure could be implemented here
  }
}

function sendMessageSessionMatch (payload: ISendASessionMessagePayload): void {
  if (!sessionId.value) return
  void onSendMessageSessionMatch(sessionId.value, payload)
}

async function onGetAllSessionMessages (sessionId: TBaseParamsId): Promise<void> {
  if (!sessionId) return
  try {
    const response = await matchService.findAllSessionMessages(sessionId)
    if (response?.data) {
      sessionMessages.value = response.data.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        text: msg.text,
        sendAt: msg.sendAt,
        isOwn: msg.isOwn !== undefined ? msg.isOwn : msg.senderId === authStore.user?.id
      }))
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
}

function getAllSessionMessages (): void {
  if (!sessionId.value) return
  $handleLoading((): Promise<void> => onGetAllSessionMessages(sessionId.value))
}

function upsertRealtimeSessionMessage (message: ISendASessionMessageData): void {
  const isOwn = message.isOwn !== undefined
    ? !!message.isOwn
    : message.senderId === authStore.user?.id

  const incoming: IMatchMessageEntry = {
    id: message.id,
    senderId: message.senderId,
    text: message.text,
    sendAt: message.sendAt,
    isOwn
  }

  const existingIndex = sessionMessages.value.findIndex(m => m.id === incoming.id)
  if (existingIndex >= 0) {
    sessionMessages.value[existingIndex] = incoming
    return
  }

  // Replace optimistic message (pre-socket) to avoid duplicates.
  if (incoming.isOwn) {
    const incomingMs = tryGetTimeMs(incoming.sendAt)
    const optimisticIndex = sessionMessages.value
      .map((m, index) => ({ m, index }))
      .reverse()
      .find(({ m }) => {
        if (!m.isOwn) return false
        if (m.text !== incoming.text) return false

        const optimisticMs = tryGetTimeMs(m.sendAt)
        if (!incomingMs || !optimisticMs) return false

        return Math.abs(incomingMs - optimisticMs) <= 15000
      })
      ?.index

    if (typeof optimisticIndex === 'number' && optimisticIndex >= 0) {
      sessionMessages.value[optimisticIndex] = incoming
      return
    }
  }

  sessionMessages.value.push(incoming)
}

async function onSendAFriendSessionRequest (sessionId: TBaseParamsId): Promise<void> {
  if (!sessionId) return
  await matchService.sendAFriendSessionRequest(sessionId)
  isFriendRequestSent.value = true
}

function sendAFriendSessionRequest (): void {
  if (!sessionId.value) return
  $handleLoading(() => onSendAFriendSessionRequest(sessionId.value), {
    loadingUnit: isSubmitting,
    toast: {
      instance: toast,
      success: {
        detail: 'ส่งคำขอเข้าร่วมเซสชันเพื่อนสำเร็จ'
      },
      error: {
        summary: 'ส่งคำขอเข้าร่วมเซสชันเพื่อนล้มเหลว'
      }
    }
  })
}

async function onAcceptFriendRequest (friendId: number): Promise<void> {
  const response = await friendService.acceptFriendRequest(friendId)
  isAccepted.value = true
  if (response.data?.status === FriendRequestStatusEnum.ACCEPTED) {
    friendStore.markRequestAccepted(friendId)
  }
}

async function onRejectFriendRequest (friendId: number): Promise<void> {
  const response = await friendService.rejectFriendRequest(friendId)
  isRejected.value = true
  if (response.data?.status === FriendRequestStatusEnum.REJECTED) {
    friendStore.markRequestRejected(friendId)
  }
}

function acceptFriendRequest (): void {
  const targetId = incomingRequesterId.value ?? partnerUserId.value

  if (!targetId) {
    return
  }
  $handleLoading(() => onAcceptFriendRequest(targetId), {
    loadingUnit: isSubmitting,
    toast: {
      instance: toast,
      success: {
        detail: 'ยอมรับเป็นเพื่อนสำเร็จ'
      },
      error: {
        summary: 'ยอมรับเป็นเพื่อนล้มเหลว'
      }
    }
  })
}

function rejectFriendRequest (): void {
  const targetId = incomingRequesterId.value ?? partnerUserId.value

  if (!targetId) {
    return
  }
  $handleLoading(() => onRejectFriendRequest(targetId), {
    loadingUnit: isSubmitting,
    toast: {
      instance: toast,
      success: {
        detail: 'ปฏิเสธคำขอเป็นเพื่อนสำเร็จ'
      },
      error: {
        summary: 'ปฏิเสธคำขอเป็นเพื่อนล้มเหลว'
      }
    }
  })
}

watch(sessionId, (newId) => {
  if (newId) {
    getAllSessionMessages()
  }
}, { immediate: true })

watch(
  () => matchStore.getLastEventByType(MatchEvent.MESSAGE)?.receivedAt,
  () => {
    const socketEvent = matchStore.getLastEventByType(MatchEvent.MESSAGE)
    if (!socketEvent) return
    if (!sessionId.value) return

    const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
    if (incomingSessionId && incomingSessionId !== sessionId.value) return

    const socketMessage = extractSessionMessageFromSocket(socketEvent.data)
    if (socketMessage) {
      upsertRealtimeSessionMessage(socketMessage)
      return
    }

    // Fallback: payload shape unknown -> refresh from API (no loading overlay).
    void onGetAllSessionMessages(sessionId.value)
  }
)

watch(
  () => matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)?.receivedAt,
  () => {
    const socketEvent = matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)
    if (!socketEvent) return
    if (!sessionId.value) return

    const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
    if (incomingSessionId && incomingSessionId !== sessionId.value) return

    isFriendRequestSent.value = true
  },
  { immediate: true }
)

function onNavigateBack (): void {
   router.push({ name: 'public-find-match' })
}
</script>

<style scoped>
</style>