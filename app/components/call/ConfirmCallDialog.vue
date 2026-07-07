<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    pt:content:class="p-0 overflow-hidden"
    pt:header:class="hidden"
    pt:mask:class="p-modal:bg-black/70 p-modal:backdrop-blur-sm p-modal:fixed p-modal:top-0 p-modal:start-0 p-modal:w-full p-modal:h-full"
    pt:root:class="!relative !bg-transparent !border-none !shadow-none !rounded-2xl !overflow-visible !p-0"
    dismissable-mask
    modal>
    <!-- ─── Card ─── -->
    <div class="call-dialog relative flex flex-col items-center rounded-2xl overflow-hidden w-[22rem] max-w-[92vw]">
      <!-- Background gradient blob -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
        <div class="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />
        <div class="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
      </div>

      <!-- ─── Top banner (caller avatar) ─── -->
      <div class="relative w-full h-28 bg-gradient-to-br from-indigo-600/80 via-violet-700/70 to-sky-600/60 flex items-end justify-center pb-0 overflow-visible">
        <!-- Subtle dot pattern overlay -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 opacity-20"
          style="background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 16px 16px;" />

        <!-- Animated ring behind avatar -->
        <div
          class="absolute bottom-0 translate-y-1/2 h-28 w-28 rounded-full bg-gradient-to-br from-teal-400/20 via-indigo-400/20 to-violet-500/20 animate-pulse"
          style="animation-duration: 2.5s" />

        <!-- Avatar (overflows below banner) -->
        <div class="absolute bottom-0 translate-y-1/2 z-10">
          <div class="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white/20 shadow-2xl">
            <img
              v-if="callerProfileImg"
              :alt="callerName"
              :src="callerProfileImg"
              class="h-full w-full object-cover">
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold text-white select-none">
              {{ callerInitial }}
            </div>
          </div>

          <!-- Ringing pulse ring -->
          <div
            class="absolute inset-0 -z-10 animate-ping rounded-full ring-2 ring-indigo-400/30"
            style="animation-duration: 1.8s" />
        </div>
      </div>

      <!-- ─── Body ─── -->
      <div class="flex w-full flex-col items-center gap-1 bg-surface-900/95 px-5 pb-5 pt-16 backdrop-blur-xl">
        <!-- Incoming call badge -->
        <div class="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 mb-1">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span class="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            มีสายเข้า
          </span>
        </div>

        <!-- Caller name -->
        <h2 class="text-xl font-bold text-white leading-tight text-center">
          {{ callerName }}
        </h2>
        <p class="text-xs text-white/40 mb-1">
          @{{ value?.callerUsername }}
        </p>

        <!-- Call type label -->
        <div class="flex items-center gap-1.5 text-white/50 text-xs font-medium">
          <Icon
            class="text-indigo-400"
            name="mdi:phone-in-talk"
            size="14px" />
          <span>โทรด้วยเสียง</span>
        </div>

        <!-- Divider -->
        <div class="my-4 h-px w-full bg-white/10" />

        <!-- Action buttons -->
        <div class="flex w-full items-center justify-center gap-4">
          <!-- Reject -->
          <div class="flex flex-col items-center gap-2">
            <button
              id="confirm-call-dialog-btn-reject"
              :disabled="isSubmitting"
              aria-label="ปฏิเสธสาย"
              class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 ring-4 ring-red-500/10 transition-all duration-200 hover:from-red-600 hover:to-rose-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              type="button"
              @click="onClickRejectCall">
              <Icon
                name="mdi:phone-hangup"
                size="24px" />
            </button>
            <span class="text-xs font-medium text-white/50 select-none">ปฏิเสธ</span>
          </div>

          <!-- Accept -->
          <div class="flex flex-col items-center gap-2">
            <button
              id="confirm-call-dialog-btn-accept"
              :disabled="isSubmitting"
              aria-label="รับสาย"
              class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/10 transition-all duration-200 hover:from-emerald-600 hover:to-green-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
              type="button"
              @click="onClickAcceptCall">
              <Icon
                name="mdi:phone"
                size="24px" />
            </button>
            <span class="text-xs font-medium text-white/50 select-none">รับสาย</span>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '~/volt/Dialog.vue'
import type { IInitiateCallData } from '~/models/response/CallRes.model'

// ─── Props & emits ─────────────────────────────────────────────────────────────
interface IProps {
  value?: IInitiateCallData | null
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  value: null,
  isSubmitting: false
})

const emit = defineEmits<{
  accept: []
  reject: []
}>()

const visible = defineModel<boolean>('visible', { default: false })

// ─── Env ──────────────────────────────────────────────────────────────────────
const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

// ─── Computed: caller info ─────────────────────────────────────────────────────
const callerName = computed((): string => {
  if (!props.value) return ''
  return props.value.callerNickname || props.value.callerUsername || 'ผู้โทร'
})

const callerProfileImg = computed((): string => {
  const raw = props.value?.callerProfileImg
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  return imageBaseUrl + raw
})

const callerInitial = computed((): string => (callerName.value?.[0] ?? '?').toUpperCase())

// ─── Actions ──────────────────────────────────────────────────────────────────
function onClickAcceptCall (): void {
  if (props.isSubmitting) return
  emit('accept')
  visible.value = false
}

function onClickRejectCall (): void {
  if (props.isSubmitting) return
  emit('reject')
  visible.value = false
}
</script>

<style scoped>
.call-dialog {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 32px 64px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(99, 102, 241, 0.15);
}
</style>
