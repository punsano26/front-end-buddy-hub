<template>
  <Card pt:root:class="w-full rounded-none">
    <template #content>
      <div
        v-if="isEditing"
        class="mb-2 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-700">
        <span>กําลังแก้ไขข้อความ</span>
        <button
          aria-label="ยกเลิกการแก้ไข"
          class="flex h-4 w-4 items-center justify-center rounded-full border border-amber-300 text-[10px] leading-none"
          type="button"
          @click="handleCancelEdit">
          x
        </button>
      </div>
      <div class="flex gap-2">
        <InputLabelField
          v-model="messageModel"
          :placeholder="isEditing ? 'แก้ไขข้อความของคุณ...' : 'พิมพ์ข้อความของคุณนี่ที่...'"
          @keyup.enter="handleSend" />
        <Button
          class="ml-2"
          color="primary"
          @click="handleSend">
          {{ isEditing ? 'บันทึก' : 'ส่ง' }}
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
