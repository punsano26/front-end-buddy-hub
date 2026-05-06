<template>
  <Card
    pt:body:class="px-3 md:px-4 py-2 md:py-3"
    pt:root:class="w-full rounded-none border-t border-surface-200 dark:border-surface-700">
    <template #content>
      <!-- ✏️ Editing banner -->
      <div
        v-if="isEditing"
        class="mb-2 flex items-center justify-between gap-2 rounded-lg
               border border-amber-300/60 bg-amber-50 dark:bg-amber-900/20
               px-3 py-1.5 text-xs text-amber-700 dark:text-amber-300">
        <span class="truncate">กำลังแก้ไขข้อความ</span>

        <button
          aria-label="ยกเลิกการแก้ไข"
          class="flex h-5 w-5 items-center justify-center rounded-full
                 hover:bg-amber-200/60 dark:hover:bg-amber-800/40 transition"
          type="button"
          @click="handleCancelEdit">
          ✕
        </button>
      </div>

      <!-- 💬 Input row -->
      <div class="flex items-center gap-2">
        <!-- input -->
        <div class="flex-1">
          <InputLabelField
            v-model="messageModel"
            :placeholder="isEditing ? 'แก้ไขข้อความของคุณ...' : 'พิมพ์ข้อความ...'"
            class="w-full"
            @keyup.enter="handleSend" />
        </div>

        <!-- send button -->
        <Button
          :disabled="!messageModel?.trim()"
          class="shrink-0 rounded-xl px-4 py-2
                 bg-gradient-primary text-white border-none
                 shadow-md shadow-indigo-500/20
                 hover:scale-105 active:scale-95
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-150"
          @click="handleSend">
          <i
            v-if="!isEditing"
            class="pi pi-send text-sm" />
          <i
            v-else
            class="pi pi-check text-sm" />
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import InputLabelField from './input/InputLabelField.vue'

interface IProps {
  modelValue?: string
  isEditing?: boolean
}

const emit = defineEmits<{
  'update:modelValue': [message: string]
  'createMessage': [message: string]
  'cancelEdit': []
}>()

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  isEditing: false
})

const messageModel = computed({
  get (): string {
    return props.modelValue
  },
  set (value: string): void {
    emit('update:modelValue', value)
  }
})

const isEditing = computed((): boolean => props.isEditing)

function handleSend (): void {
  if (!messageModel.value.trim()) return
  emit('createMessage', messageModel.value.trim())
}

function handleCancelEdit (): void {
  emit('cancelEdit')
}
</script>
