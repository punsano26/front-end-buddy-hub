<template>
  <Card
    pt:body:class="px-3 md:px-5 lg:px-8 xl:px-8 py-2 md:py-3"
    pt:root:class="w-full rounded-none border-t border-surface-200 dark:border-surface-700 safe-area-pad">
    <template #content>
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
      <div
        v-if="imagePreview"
        class="mb-2 flex items-center gap-3 rounded-2xl border border-surface-200/70 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-surface-700/60 dark:bg-surface-900/40">
        <div class="relative h-14 w-14 shrink-0">
          <img
            :src="imagePreview"
            alt="Preview"
            class="h-14 w-14 rounded-xl object-cover ring-1 ring-surface-200 dark:ring-surface-700">
          <button
            aria-label="ลบรูป"
            class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface-900 text-white shadow-md transition hover:scale-105 dark:bg-surface-200 dark:text-surface-900"
            type="button"
            @click="clearImageSelection">
            x
          </button>
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-surface-700 dark:text-surface-200">
            รูปที่เลือก
          </p>
          <p class="truncate text-[11px] text-surface-500 dark:text-surface-400">
            {{ selectedImageName || 'image' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-white text-surface-700 shadow-sm transition hover:scale-105 dark:border-surface-700 dark:bg-surface-900/40 dark:text-surface-200"
          type="button"
          @click="onSelectImage">
          <i class="pi pi-image" />
        </button>
        <input
          ref="imageInput"
          accept="image/*"
          class="hidden"
          type="file"
          @change="onImageChange">
        <div class="flex-1">
          <InputLabelTextarea
            v-model="messageModel"
            :placeholder="isEditing ? 'แก้ไขข้อความของคุณ...' : 'พิมพ์ข้อความ...'"
            class="w-full"
            @keyup.enter="handleSend" />
        </div>
        <Button
          :disabled="!canSend"
          class="shrink-0 rounded-xl px-4 py-2
             bg-gradient-primary text-white border-none
             shadow-md shadow-indigo-500/20
             hover:scale-105 active:scale-95
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-150"
          @click="handleSend"
          @pointerdown.prevent>
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
import InputLabelTextarea from './input/InputLabelTextarea.vue'
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
