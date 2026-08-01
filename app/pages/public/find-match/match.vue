<template>
  <div class="flex flex-col w-full h-full min-h-0 bg-surface-50 dark:bg-surface-950 overflow-hidden md:p-6 md:max-w-5xl md:mx-auto md:h-[calc(var(--app-height,100dvh)-64px)] md:my-8 md:rounded-2xl md:border md:border-surface-200 md:dark:border-surface-800 md:shadow-xl transition-[color,background-color,border-color,box-shadow,opacity] duration-300">
    <!-- Sticky / Top Profile Header -->
    <div class="shrink-0 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 py-3 md:px-6 md:py-4 shadow-sm z-10">
      <div class="flex items-center justify-between gap-4">
        <!-- Left: Back Button & User Info -->
        <div class="flex items-center gap-3 min-w-0">
          <Button
            class="w-10 h-10 flex items-center justify-center shrink-0 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label="Back"
            icon="pi pi-arrow-left"
            severity="secondary"
            rounded
            text
            @click="onNavigateBack" />
          <div class="relative shrink-0 select-none">
            <!-- Pulsing premium avatar outline -->
            <div class="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-primary p-0.5 shadow-md flex items-center justify-center relative overflow-hidden animate-pulse-slow">
              <div class="w-full h-full rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400">
                <i class="pi pi-user text-lg md:text-xl" />
              </div>
            </div>
            <span class="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-surface-900 rounded-full shadow-md animate-pulse" />
          </div>
          <div class="flex flex-col min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm md:text-base font-bold text-surface-900 dark:text-surface-0 truncate leading-tight">
                ผู้ใช้งานคนนี้คือเพื่อนใหม่ของคุณ
              </span>
              <Tag
                class="text-[9px] md:text-[10px] px-2 py-0.5 font-semibold bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 shrink-0"
                severity="secondary"
                value="Private"
                rounded />
            </div>
            <span class="text-xs text-surface-400 dark:text-surface-500 truncate mt-0.5">ข้อมูลถูกซ่อนเพื่อความเป็นส่วนตัว</span>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Desktop Action buttons -->
          <div class="hidden sm:flex items-center gap-2">
            <template v-if="isAccepted">
              <Button
                class="px-4 py-2 font-medium bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-800/50 shadow-sm"
                icon="pi pi-check"
                label="เป็นเพื่อนกันแล้ว"
                size="small"
                disabled />
            </template>
            <template v-else-if="isIncomingRequest">
              <Button
                class="px-4 py-2 font-medium shadow-sm"
                icon="pi pi-bell"
                label="ได้รับคำขอเป็นเพื่อนแล้ว"
                size="small"
                disabled />
            </template>
            <template v-else>
              <Button
                :disabled="isFriendRequestSent || isSubmitting"
                :icon="isFriendRequestSent ? 'pi pi-check' : 'pi pi-user-plus'"
                :label="isFriendRequestSent ? 'ส่งคำขอแล้ว' : 'เพิ่มเพื่อน'"
                class="px-4 py-2 font-medium shadow-sm bg-gradient-primary border-0 text-slate-950 hover:opacity-90 active:scale-98 transition-all"
                size="small"
                @click="sendAFriendSessionRequest" />
            </template>
            <Button
              icon="pi pi-flag"
              class="px-4 py-2 font-medium shadow-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              label="รายงาน"
              severity="secondary"
              size="small"
              outlined
              @click="onOpenReportDialog" />
          </div>

          <!-- Mobile Actions Dropdown menu -->
          <div class="sm:hidden relative">
            <Button
              class="w-10 h-10 flex items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Actions Menu"
              icon="pi pi-ellipsis-v"
              severity="secondary"
              rounded
              text
              @click="toggleMobileMenu" />
            <Popover
              ref="mobileMenu"
              class="shadow-xl rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <div class="flex flex-col p-1.5 min-w-[170px] gap-1 select-none">
                <template v-if="isAccepted">
                  <Button
                    class="justify-start w-full text-green-600 dark:text-green-400 font-medium"
                    icon="pi pi-check"
                    label="เป็นเพื่อนกันแล้ว"
                    size="small"
                    disabled
                    text />
                </template>
                <template v-else-if="isIncomingRequest">
                  <Button
                    class="justify-start w-full font-medium"
                    icon="pi pi-bell"
                    label="ได้รับคำขอแล้ว"
                    size="small"
                    disabled
                    text />
                </template>
                <template v-else>
                  <Button
                    :disabled="isFriendRequestSent || isSubmitting"
                    :icon="isFriendRequestSent ? 'pi pi-check' : 'pi pi-user-plus'"
                    :label="isFriendRequestSent ? 'ส่งคำขอแล้ว' : 'เพิ่มเพื่อน'"
                    class="justify-start w-full text-primary-500 font-medium hover:bg-primary-50 dark:hover:bg-primary-950/20"
                    size="small"
                    text
                    @click="sendAFriendSessionRequestFromMenu" />
                </template>
                <div class="h-[1px] bg-surface-200 dark:bg-surface-800 my-1" />
                <Button
                  icon="pi pi-flag"
                  class="justify-start w-full text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-950/20"
                  label="รายงานผู้ใช้"
                  severity="danger"
                  size="small"
                  text
                  @click="onOpenReportDialogFromMenu" />
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>

    <SpaceChat
      :messages="matchStore.sessionMessages"
      class="flex-1 min-h-0"
      @send-message="sendMessageSessionMatch" />

    <!-- Report Dialog -->
    <ReportModalDialog
      v-model:visible="isReportDialogVisible"
      :reported-user-id="partnerUserId || 0" />
    <ConfirmModalDialog
      v-model:visible="dialogOpenConfirmLeaveSessionEarly"
      confirm-button="ใช่, ฉันต้องการออกจากเซสชัน"
      message="คุณแน่ใจว่าต้องการออกจากเซสชันหรือไม่?"
      title="คุณต้องการออกจากเซสชัน ?"
      @confirm="onConfirmLeaveSessionEarly" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import SpaceChat from '~/components/match/SpaceChat.vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { MatchEvent } from '~/models/enums/Match.enum'
import type { ISendASessionMessagePayload } from '~/models/request/MatchReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import MatchProvider, { type IMatchProvider } from '~/resource/provider/Match.provider'
import { useAuthStore } from '~/stores/Auth'
import { useFriendStore } from '~/stores/Friend'
import { extractSessionMessageFromSocket, findPartnerIdFromAnywhere, getSessionIdFromEvent, useMatchStore } from '~/stores/Match'

definePageMeta({
  layout: 'fullscreen'
})

const matchService: IMatchProvider = new MatchProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const matchStore = useMatchStore()
const friendStore = useFriendStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const dialogOpenConfirmLeaveSessionEarly = ref(false)
const isSubmitting = ref(false)
const isReportDialogVisible = ref(false)
const mobileMenu = ref()

function toggleMobileMenu (event: Event): void {
  mobileMenu.value?.toggle(event)
}

function sendAFriendSessionRequestFromMenu (): void {
  mobileMenu.value?.hide()
  sendAFriendSessionRequest()
}

function onOpenReportDialogFromMenu (): void {
  mobileMenu.value?.hide()
  isReportDialogVisible.value = true
}

function onOpenReportDialog (): void {
  isReportDialogVisible.value = true
}

const sessionId = computed<TBaseParamsId>(() => {
  return getSessionIdFromEvent(matchStore.getLastEventByType(MatchEvent.PERSISTED)?.data)
    ?? getSessionIdFromEvent(matchStore.getLastEventByType(MatchEvent.FOUND)?.data)
    ?? toSessionId(route.params.sessionId ?? route.query.sessionId)
})

function toSessionId (value: unknown): TBaseParamsId {
  if (Array.isArray(value)) {
    return toSessionId(value[0])
  }

  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number' && Number.isFinite(value)) return value

  return undefined
}

const partnerUserId = computed<number | null>(() => {
  const fromFriendReq = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)?.data)
  if (fromFriendReq) return fromFriendReq

  const fromPersisted = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.PERSISTED)?.data)
  if (fromPersisted) return fromPersisted

  const fromFound = findPartnerIdFromAnywhere(matchStore.getLastEventByType(MatchEvent.FOUND)?.data)
  if (fromFound) return fromFound

  const partnerMsg = matchStore.sessionMessages.find((msg) => !msg.isOwn && typeof msg.senderId === 'number')
  if (partnerMsg?.senderId) return partnerMsg.senderId

  const queryPartnerId = Number(route.query.partnerUserId)
  if (Number.isFinite(queryPartnerId) && queryPartnerId > 0) return queryPartnerId

  return null
})

const isIncomingRequest = computed(() => {
  if (partnerUserId.value && friendStore.isIncomingPending(partnerUserId.value)) {
    return true
  }

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

const _isFriendRequestSent = ref(false)
const isFriendRequestSent = computed({
  get: () => {
    if (partnerUserId.value && friendStore.isOutgoingPending(partnerUserId.value)) {
      return true
    }
    return _isFriendRequestSent.value
  },
  set: (val) => {
    _isFriendRequestSent.value = val
  }
})

const _isAccepted = ref(false)
const isAccepted = computed({
  get: () => {
    if (partnerUserId.value && friendStore.getResolvedStatus(partnerUserId.value) === FriendRequestStatusEnum.ACCEPTED) {
      return true
    }
    return _isAccepted.value
  },
  set: (val) => {
    _isAccepted.value = val
  }
})

function sendMessageSessionMatch (payload: ISendASessionMessagePayload): void {
  if (!sessionId.value) return
  void matchStore.sendSessionMessage(sessionId.value, payload)
}

function getAllSessionMessages (): void {
  if (!sessionId.value) return
  $handleLoading(() => matchStore.fetchSessionMessages(sessionId.value))
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

watch(sessionId, (newId) => {
  if (import.meta.client && newId) {
    getAllSessionMessages()
  }
}, { immediate: true })

watch(
  () => matchStore.getLastEventByType(MatchEvent.MESSAGE)?.receivedAt, () => {
    const socketEvent = matchStore.getLastEventByType(MatchEvent.MESSAGE)
    if (!socketEvent) return
    if (!sessionId.value) return

    const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
    if (incomingSessionId && incomingSessionId !== sessionId.value) return

    const socketMessage = extractSessionMessageFromSocket(socketEvent.data)
    if (socketMessage) {
      matchStore.upsertRealtimeSessionMessage(socketMessage, authStore.user?.id)
      return
    }

    // Fallback: payload shape unknown -> refresh from API (no loading overlay).
    void matchStore.fetchSessionMessages(sessionId.value)
  }
)

watch(
  () => matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)?.receivedAt, () => {
    const socketEvent = matchStore.getLastEventByType(MatchEvent.FRIEND_REQUEST)
    if (!socketEvent) return
    if (!sessionId.value) return

    const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
    if (incomingSessionId && incomingSessionId !== sessionId.value) return

    isFriendRequestSent.value = true
  }, { immediate: true }
)

watch(
  () => matchStore.getLastEventByType(MatchEvent.PARTNER_LEFT)?.receivedAt, () => {
    const socketEvent = matchStore.getLastEventByType(MatchEvent.PARTNER_LEFT)
    if (!socketEvent) return
    if (!sessionId.value) return

    const incomingSessionId = getSessionIdFromEvent(socketEvent.data)
    if (incomingSessionId && incomingSessionId !== sessionId.value) return

    toast.add({
      severity: 'info',
      summary: 'คู่สนทนาออกจากห้องแล้ว',
      detail: 'ระบบกำลังนำคุณกลับไปหน้าค้นหาคู่',
      life: 3000
    })

    router.push({ name: 'public-find-match' })
  }
)

async function leaveTheMatchChatSessionEarly (): Promise<void> {
  if (!sessionId.value) return
  await matchService.leaveTheMatchChatSessionEarly(sessionId.value)
  router.push({ name: 'public-find-match' })
}

function onNavigateBack (): void {
  dialogOpenConfirmLeaveSessionEarly.value = true
}

function onConfirmLeaveSessionEarly (): void {
  $handleLoading(leaveTheMatchChatSessionEarly, {
    toast: {
      instance: toast
    }
  })
}
</script>

<style scoped>
@keyframes pulseSlow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 10px 15px -3px rgba(59, 209, 220, 0.3), 0 4px 6px -4px rgba(95, 168, 242, 0.3);
  }
}
.animate-pulse-slow {
  animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
