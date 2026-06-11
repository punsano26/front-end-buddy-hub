<template>
  <NuxtLink
    :to="{ name: 'public-rent-chat-id', params: { id: props.conversation.id } }"
    class="block w-full min-w-0 group">
    <div
      :class="cardClass"
      class="w-full max-w-full overflow-hidden rounded-xl cursor-pointer transition-all duration-200">
      <div class="p-3">
        <div class="flex items-start gap-3 min-w-0">
          <!-- Avatar with status indicator -->
          <div class="relative shrink-0 mt-0.5">
            <img
              :class="isFinished ? 'opacity-60 grayscale-[35%]' : ''"
              :src="props.conversation.profileImg || '/png/upload-profile.png'"
              alt="Profile image"
              class="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800">
            <span
              v-if="isFinished"
              class="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 text-white text-[8px] font-bold">
              <i class="pi pi-times" />
            </span>
            <span
              v-else-if="props.conversation.status === 'online'"
              class="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            <span
              v-else-if="props.conversation.status === 'idle'"
              class="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <!-- Mid Section: Name, Tag, Ratings, Time -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span
                :class="isFinished ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'"
                class="font-bold text-sm truncate">
                {{ props.conversation.nickname }}
              </span>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                {{ dayjs(props.conversation.lastMessageCreatedAt).format('hh:mm A') }}
              </span>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                  <i class="pi pi-star-fill text-[9px]" />
                  <span>{{ props.conversation.rating }}</span>
                </div>

              </div>

            </div>

            <p
              :class="isFinished ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-500 dark:text-slate-400'"
              class="text-xs truncate">
              {{ props.conversation.lastMessageText }}
            </p>
          </div>
        </div>

        <!-- Footer: Rate & Session Status -->
        <div class="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
          <div class="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <i
              :class="isFinished ? 'text-slate-400' : 'text-amber-500'"
              class="pi pi-coin text-[10px]" />
            <span
              :class="isFinished ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'"
              class="font-medium">
              {{ props.conversation.rate }}
            </span>
            <span class="text-slate-400">/นาที</span>
          </div>
          <div
            v-if="isFinished"
            class="flex items-center gap-1 text-[10px] text-rose-500 font-bold">
            <i class="pi pi-lock text-[9px]" />
            <span>ปิดเซสชัน</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  conversation: any
}>()

const route = useRoute()

const isActive = computed((): boolean => {
  return Number(route.params.id) === props.conversation.id
})

const isFinished = computed((): boolean => {
  return props.conversation.sessionStatus === 'finished'
})

const cardClass = computed((): string => {
  if (isFinished.value) {
    return isActive.value
      ? 'border-2 border-rose-500 dark:border-rose-500 bg-rose-50/10 dark:bg-rose-950/10 shadow-sm shadow-rose-500/5'
      : 'border border-rose-200 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-800 bg-rose-50/5 dark:bg-rose-950/5 hover:bg-rose-50/10 dark:hover:bg-rose-950/10'
  } else {
    return isActive.value
      ? 'border-2 border-blue-500 dark:border-blue-500 bg-blue-50/10 dark:bg-blue-950/10 shadow-sm shadow-blue-500/10'
      : 'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm'
  }
})
</script>
