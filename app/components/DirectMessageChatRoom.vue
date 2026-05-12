<template>
  <div
    class="border-t border-[#E4E6EB] bg-white px-3 py-2 dark:border-surface-700 dark:bg-surface-900">
    <!-- Editing -->
    <Transition name="fade">
      <div
        v-if="isEditing"
        class="mb-2 flex items-center justify-between rounded-2xl bg-[#F0F2F5] px-3 py-2 dark:bg-surface-800">
        <div class="flex items-center gap-2">
          <div
            class="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2]/10">
            <i class="pi pi-pencil text-xs text-[#1877F2]" />
          </div>

          <div class="flex flex-col">
            <span
              class="text-xs font-semibold text-surface-800 dark:text-surface-100">
              กำลังแก้ไขข้อความ
            </span>

            <span
              class="text-[11px] text-surface-500 dark:text-surface-400">
              Edit your message
            </span>
          </div>
        </div>

        <button
          class="flex h-7 w-7 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
          type="button"
          @click="handleCancelEdit">
          <i class="pi pi-times text-xs" />
        </button>
      </div>
    </Transition>

    <!-- Image Preview -->
    <Transition name="fade">
      <div
        v-if="imagePreview"
        class="mb-2 flex items-center gap-3 rounded-2xl bg-[#F0F2F5] p-2 dark:bg-surface-800">
        <div class="relative">
          <img
            :src="imagePreview"
            alt="Preview"
            class="h-14 w-14 rounded-2xl object-cover">

          <button
            class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-lg transition active:scale-95"
            type="button"
            @click="clearImageSelection">
            <i class="pi pi-times text-[10px]" />
          </button>
        </div>

        <div class="min-w-0 flex-1">
          <p
            class="truncate text-sm font-medium text-surface-800 dark:text-surface-100">
            {{ selectedImageName || 'Image' }}
          </p>

          <p
            class="text-xs text-surface-500 dark:text-surface-400">
            พร้อมส่งรูปภาพ
          </p>
        </div>
      </div>
    </Transition>

    <!-- Chat Input -->
    <div
      class="flex min-h-[36px] items-center gap-2 rounded-full bg-[#F0F2F5] px-2 py-0.5 dark:bg-surface-800">
      <!-- Upload -->
      <button
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#1877F2] transition hover:bg-black/5 active:scale-95 dark:hover:bg-white/10"
        type="button"
        @click="onSelectImage">
        <i class="pi pi-image text-base" />
      </button>

      <input
        ref="imageInput"
        accept="image/*"
        class="hidden"
        type="file"
        @change="onImageChange">

      <!-- Input -->
      <div class="flex-1">
        <textarea
          v-model="messageModel"
          :placeholder="
            isEditing
              ? 'แก้ไขข้อความ...'
              : 'Aa'
          "
          class="facebook-chat-input w-full"
          rows="1"
          @keydown.enter.prevent="handleSend" />
      </div>

      <!-- Send -->
      <button
        :disabled="!canSend"
        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-all duration-150 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-[#BCC0C4]"
        type="button"
        @click="handleSend">
        <i
          v-if="!isEditing"
          class="pi pi-send text-[10px]" />

        <i
          v-else
          class="pi pi-check text-[10px]" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadCategoryEnum } from '~/models/enums/Upload.enum'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import type { IUploadResultData, IUploadUrlResultData } from '~/models/response/UploadRes.model'
import type { IUploadProvider } from '~/resource/provider/Upload.provider'
import UploadProvider from '~/resource/provider/Upload.provider'

interface IProps {
  modelValue?: string
  isEditing?: boolean
  partnerId?: number
}
const { $handleLoading } = useNuxtApp()
const emit = defineEmits<{
  'update:modelValue': [message: string]
  'createMessage': [message: string]
  'createMediaMessage': [message: string | ICreateMessageData]
  'cancelEdit': []
}>()
const UploadService: IUploadProvider = new UploadProvider()
const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  isEditing: false,
  partnerId: undefined
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
const imageInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const selectedFile = ref<File | null>(null)
const selectedImageName = computed((): string => selectedFile.value?.name || '')
const canSend = computed((): boolean => Boolean(messageModel.value.trim()) || Boolean(selectedFile.value))

function handleSend (): void {
  const trimmedMessage = messageModel.value.trim()
  const file = selectedFile.value

  if (!trimmedMessage && !file) return

  if (file) {
    $handleLoading(async (): Promise<void> => {
      const result = await handleUpload(file, UploadCategoryEnum.MESSAGE)
      if (isUploadUrlResultData(result)) {
        emit('createMediaMessage', result.url)
      } else if (isCreateMessageData(result)) {
        emit('createMediaMessage', result)
      } else {
        throw new Error('Upload response missing url or message')
      }
      clearImageSelection()
      if (trimmedMessage) {
        emit('createMessage', trimmedMessage)
      }
    })
    return
  }

  emit('createMessage', trimmedMessage)
}

function onSelectImage (): void {
  imageInput.value?.click()
}

function onImageChange (event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = URL.createObjectURL(file)
}

function clearImageSelection (): void {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = ''
  selectedFile.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

function isUploadUrlResultData (data: IUploadResultData): data is IUploadUrlResultData {
  return typeof (data as IUploadUrlResultData).url === 'string'
}

function isCreateMessageData (data: IUploadResultData): data is ICreateMessageData {
  return typeof (data as ICreateMessageData).id === 'number'
    && typeof (data as ICreateMessageData).messageType === 'string'
    && typeof (data as ICreateMessageData).messageText === 'string'
}

async function handleUpload (file: File, category: UploadCategoryEnum): Promise<IUploadResultData> {
  const response = await UploadService.onUpload({
    files: file,
    category,
    partnerId: props.partnerId
  })
  const result = response.data
  return result
}
function handleCancelEdit (): void {
  emit('cancelEdit')
}
</script>

<style scoped>
.facebook-chat-input {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  resize: none !important;

  padding: 6px 0 !important;

  font-size: 14px;
  line-height: 18px;

  min-height: 18px !important;
  max-height: 72px !important;

  overflow-y: auto !important;
}

.facebook-chat-input:focus {
  outline: none !important;
  box-shadow: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
