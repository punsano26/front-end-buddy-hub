<template>
  <header class="bg-white/90 border-b border-slate-200/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90 pb-3 pt-[calc(env(safe-area-inset-top)+0.6rem)] px-4 md:px-6 relative shrink-0 transition-colors duration-250">
    <div class="absolute bg-gradient-primary bottom-0 h-[1px] left-0 opacity-60 right-0" />

    <div class="flex gap-3 items-center justify-between max-w-7xl mx-auto shrink-0">
      <div class="flex gap-3 items-center min-w-0">
        <ButtonBack
          :to="{ name: 'public-rent-chat' }"
          class="active:scale-95 shrink-0 text-slate-600 transition-transform dark:text-slate-300"
          icon="mdi:arrow-left" />

        <div class="relative shrink-0">
          <img
            :class="store.currentPartner?.sessionStatus === 'finished' ? 'opacity-60 grayscale-[35%]' : ''"
            :src="store.partnerProfileImg"
            alt="Profile Image"
            class="border border-slate-200/60 h-10 object-cover rounded-xl shadow-sm w-10 dark:border-slate-800">
          <span
            v-if="store.currentPartner?.sessionStatus === 'finished'"
            class="absolute bg-rose-550 border border-white flex h-3.5 items-center justify-center rounded-full text-[8px] text-white w-3.5 -bottom-0.5 -right-0.5 dark:border-slate-900 font-bold">
            <i class="pi pi-times" />
          </span>
          <span
            v-else-if="store.partner?.isOnline === true"
            class="absolute bg-emerald-500 border-2 border-white h-3 rounded-full w-3 -bottom-0.5 -right-0.5 dark:border-slate-900" />
          <span
            v-else-if="store.partner?.isOnline === false"
            class="absolute bg-amber-500 border-2 border-white h-3 rounded-full w-3 -bottom-0.5 -right-0.5 dark:border-slate-900" />
        </div>

        <!-- Partner Name & Category -->
        <div class="leading-tight min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="font-bold text-slate-850 text-sm truncate dark:text-slate-50 md:text-base">
              {{ store.partnerName }}
            </p>
          </div>

          <p
            v-if="store.item?.status === RentStatusEnum.COMPLETED"
            class="flex items-center gap-1.5 font-semibold mt-0.5 text-[11px] text-rose-500">
            <span class="bg-rose-550 h-1.5 rounded-full w-1.5" />
            เซสชันสิ้นสุดแล้ว
          </p>
        </div>
      </div>

      <!-- Price Rate / Session overlay -->
      <div class="flex items-center gap-3 shrink-0">
        <div class="bg-white/50 border border-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs dark:bg-slate-950/50 dark:border-slate-850">
          <i class="pi pi-coin text-amber-500" />
          <span class="font-bold text-slate-700 dark:text-slate-200">{{ store.countdownText }}</span>
          <span
            v-if="store.currentPartner?.sessionStatus === 'active'"
            class="text-slate-400">/นาที</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RentStatusEnum } from '~/models/enums/Rent.enum'
import { useRentChatStore } from '~/stores/RentChat'

const store = useRentChatStore()
</script>
