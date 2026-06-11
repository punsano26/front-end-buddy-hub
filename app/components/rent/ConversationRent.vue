<template>
  <NuxtLink
    :to="{ name: 'public-rent-chat-id', params: { id: props.conversation.id } }"
    class="block w-full min-w-0">
    <Card
      :class="isActive ? 'ring-1 ring-blue-500 border-blue-500 dark:border-blue-500 bg-blue-50/10 dark:bg-blue-950/10' : ''"
      class="w-full max-w-full overflow-hidden transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm rounded-xl cursor-pointer"
      pt:body:class="p-3">
      <template #content>
        <div class="flex items-start gap-3 min-w-0">
          <div class="relative shrink-0 mt-0.5">
            <img
              :src="props.conversation.profileImg || '/png/upload-profile.png'"
              alt="Profile image"
              class="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800">
            <span
              v-if="props.conversation.status === 'online'"
              class="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            <span
              v-else-if="props.conversation.status === 'idle'"
              class="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <!-- Mid Section: Name, Tag, Ratings, Time -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-bold text-sm truncate text-slate-800 dark:text-slate-100">
                {{ props.conversation.nickname }}
              </span>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap shrink-0">
                {{ dayjs(props.conversation.lastMessageCreatedAt).format('hh:mm A') }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 mb-1.5">

              <div class="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                <i class="pi pi-star-fill text-[9px]" />
                <span>{{ props.conversation.rating }}</span>
              </div>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
              {{ props.conversation.lastMessageText }}
            </p>
          </div>
        </div>


        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <i class="pi pi-coin text-slate-400 dark:text-slate-500 text-[10px]" />
            <span class="font-medium text-slate-700 dark:text-slate-300">{{ props.conversation.rate }}</span>
            <span class="text-slate-400">/นาที</span>
          </div>

        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  conversation: any
}>()

const route = useRoute()
const isActive = computed((): boolean => {
  return Number(route.params.id) === props.conversation.id
})
</script>

<style scoped>
/* Custom Card components overrides if any */
:deep(.p-card) {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
