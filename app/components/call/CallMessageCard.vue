<template>
  <div class="flex items-center gap-3 py-1 min-w-[200px] sm:min-w-[220px]">
    <!-- Icon Circle -->
    <div
      :class="[
        chat.messageType === chatEnum.MISSED_CALL
          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 ring-1 ring-rose-300/40 dark:ring-rose-800/40'
          : chat.messageType === chatEnum.START_CALL
            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-300/40 dark:ring-emerald-800/40'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700'
      ]"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105">
      <img
        :src="callIcon"
        alt="Call status"
        class="h-5 w-5 object-contain dark:invert">
    </div>

    <!-- Call Info -->
    <div class="flex flex-col min-w-0 flex-1">
      <span class="text-sm font-semibold leading-tight">
        {{ callTitle }}
      </span>
      <span
        :class="isOwn ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'"
        class="text-[11px] opacity-80 mt-0.5">
        {{ callSubtitle }}
      </span>
    </div>

    <!-- Call Back Action Button using Volt Button -->
    <Button
      v-if="chat.messageType === chatEnum.MISSED_CALL"
      :class="
        isOwn
          ? '!bg-white/20 !text-white hover:!bg-white/30 backdrop-blur-xs'
          : '!bg-indigo-50 dark:!bg-indigo-950/40 !text-indigo-600 dark:!text-indigo-300 hover:!bg-indigo-100 dark:hover:!bg-indigo-900/50 !border !border-indigo-200/50 dark:!border-indigo-800/40'
      "
      class="ml-1 !px-3 !py-1.5 !text-xs !font-semibold rounded-xl shrink-0 shadow-xs active:scale-95 cursor-pointer border-none"
      size="small"
      type="button"
      @click.stop="onCallBack">
      <i class="pi pi-phone text-[10px]" />
      <span>โทรกลับ</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { chatEnum } from '~/models/enums/Chat.enum'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import Button from '~/volt/Button.vue'

interface IProps {
  chat: ICreateMessageData
  isOwn?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  isOwn: false
})

const emit = defineEmits<{
  clickCall: []
}>()

const callIcon = computed((): string => {
  switch (props.chat.messageType) {
    case chatEnum.START_CALL:
      return '/svg/start-call.svg'
    case chatEnum.END_CALL:
      return '/svg/end-call.svg'
    case chatEnum.MISSED_CALL:
      return '/svg/missed-call.svg'
    default:
      return '/svg/start-call.svg'
  }
})

const callTitle = computed((): string => {
  if (
    props.chat.messageText
    && !Object.values(chatEnum).includes(props.chat.messageText as chatEnum)
  ) {
    return props.chat.messageText
  }
  switch (props.chat.messageType) {
    case chatEnum.START_CALL:
      return 'เริ่มการโทร'
    case chatEnum.END_CALL:
      return 'สิ้นสุดการโทร'
    case chatEnum.MISSED_CALL:
      return 'ไม่ได้รับสาย'
    default:
      return 'สายโทรศัพท์'
  }
})

const callSubtitle = computed((): string => {
  switch (props.chat.messageType) {
    case chatEnum.START_CALL:
      return props.isOwn ? 'คุณเริ่มการโทร' : 'สายโทรเข้า'
    case chatEnum.END_CALL:
      return 'การโทรจบแล้ว'
    case chatEnum.MISSED_CALL:
      return props.isOwn ? 'ปลายทางไม่ได้รับสาย' : 'คุณไม่ได้รับสาย'
    default:
      return 'สายโทรศัพท์'
  }
})

function onCallBack (): void {
  emit('clickCall')
}
</script>

<style scoped></style>
