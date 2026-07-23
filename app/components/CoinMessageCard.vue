<template>
  <div class="flex flex-col gap-2 py-1 min-w-[210px] sm:min-w-[240px]">
    <div
      :class="isOwn ? 'border-white/20' : 'border-slate-200 dark:border-slate-800'"
      class="flex items-center justify-between gap-2 pb-1.5 border-b">
      <span
        :class="
          isOwn
            ? 'bg-white/20 text-white'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20 border border-amber-500/20'
        "
        class="inline-flex items-center justify-center h-5 px-2 text-[10px] font-bold rounded-full">
        <i class="pi pi-bolt mr-1 text-[9px]" />
        BUDDY COIN
      </span>
      <span
        :class="isOwn ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'"
        class="text-[10px] font-medium opacity-80">
        {{ isOwn ? 'ส่งคอยน์สำเร็จ' : 'ได้รับคอยน์' }}
      </span>
    </div>

    <div class="flex items-center gap-3 py-1">
      <div
        :class="
          isOwn
            ? 'bg-white/20 ring-1 ring-white/30 backdrop-blur-xs'
            : 'bg-amber-500/10 dark:bg-amber-500/20 ring-1 ring-amber-500/30'
        "
        class="relative shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl p-2 transition-transform group-hover:scale-105">
        <img
          alt="Coin granted"
          class="h-8 w-8 object-contain drop-shadow-xs"
          src="/svg/coin-granted.svg"
          @error="handleImageError">
      </div>

      <div class="flex flex-col min-w-0 flex-1">
        <span
          :class="isOwn ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'"
          class="text-[11px] font-medium opacity-85">
          {{ isOwn ? 'คุณโอนคอยน์ให้เพื่อน' : 'ได้รับคอยน์จากเพื่อน' }}
        </span>
        <span
          :class="isOwn ? 'text-white' : 'text-slate-900 dark:text-amber-400'"
          class="text-base font-extrabold tracking-tight">
          {{ chat.messageText || 'คอยน์พิเศษ' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICreateMessageData } from '~/models/response/ChatRes.model'

interface IProps {
  chat: ICreateMessageData
  isOwn?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isOwn: false
})

function handleImageError (event: Event): void {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = props.isOwn ? '/svg/coin-logo-white.svg' : '/svg/coin-logo-black.svg'
  }
}
</script>

<style scoped></style>
