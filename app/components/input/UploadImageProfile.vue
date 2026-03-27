<template>
  <p class="text-sm">
    {{ props.label }}
  </p>

  <!-- Banner -->
  <div class="relative w-full">
    <img
      :src="bannerPreview || props.value?.bannerImg || '/png/upload-banner.png'"
      class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl">

    <div
      class="absolute bottom-2 right-2 w-7 h-7 rounded-full border-2 border-white bg-white flex items-center justify-center cursor-pointer"
      @click="bannerInput?.click()">
      <img
        alt="edit"
        class="w-4 h-4"
        src="/svg/edit-icon.svg">
    </div>

    <!-- Hidden input สำหรับ banner -->
    <input
      ref="bannerInput"
      accept="image/*"
      class="hidden"
      type="file"
      @change="onBannerChange">
  </div>

  <!-- Avatar -->
  <div class="flex -mt-14 px-4">
    <div class="relative w-24 h-24">
      <img
        :src="avatarPreview || props.value?.profileImg || '/png/upload-profile.png'"
        class="w-24 h-24 rounded-full border-4 border-surface-0 object-cover">
      <div
        class="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white bg-white flex items-center justify-center cursor-pointer"
        @click="avatarInput?.click()">
        <img
          alt="edit"
          class="w-4 h-4"
          src="/svg/edit-icon.svg">
      </div>

      <!-- Hidden input สำหรับ avatar -->
      <input
        ref="avatarInput"
        accept="image/*"
        class="hidden"
        type="file"
        @change="onAvatarChange">
    </div>
  </div>

  <Button
    v-if="hasSelectedImage"
    class="mt-4 text-sm font-bold w-full"
    pt:root:class="border-none justify-center px-2 rounded-xl"
    @click="onSubmit">
    อัปโหลดรูปภาพ
  </Button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { UploadCategoryEnum } from '~/models/enums/Upload.enum'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { ICreateUploadData } from '~/models/response/๊UploadRes.model'
import type { IUploadProvider } from '~/resource/provider/Upload.provider'
import UploadProvider from '~/resource/provider/Upload.provider'

const bannerInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const { $handleLoading } = useNuxtApp()
const bannerPreview = ref<string>('')
const avatarPreview = ref<string>('')
const toast = useToast()
const UploadService: IUploadProvider = new UploadProvider()
const authStore = useAuthStore()
const hasSelectedImage = computed((): boolean => {
  return Boolean(bannerPreview.value || avatarPreview.value)
})
interface IProps {
  tag?: 'label' | 'div'
  label?: string
  required?: boolean
  bold?: boolean
  rules?: ((v: any) => boolean | string)[]
  showError?: boolean
  value?: IFindOneCurrentUserData
}
const props = withDefaults(defineProps<IProps>(), {
  tag: 'label',
  label: undefined,
  required: false,
  bold: false
})

const emit = defineEmits<{
  update: []
}>()
function onBannerChange (event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  bannerPreview.value = URL.createObjectURL(file)
}

function onAvatarChange (event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  avatarPreview.value = URL.createObjectURL(file)
}

function resetPreviews (): void {
  bannerPreview.value = ''
  avatarPreview.value = ''
}

async function handleUpload (file: File, category: UploadCategoryEnum): Promise<ICreateUploadData> {
  const response = await UploadService.onUpload({
    file,
    category
  })
  return response.data
}

async function useSubmit (): Promise<void> {
  if (bannerInput.value?.files?.[0]) {
    await handleUpload(
      bannerInput.value.files[0], UploadCategoryEnum.BANNER
    )
  }

  if (avatarInput.value?.files?.[0]) {
    const avatarRes = await handleUpload(
      avatarInput.value.files[0], UploadCategoryEnum.PROFILE
    )
    authStore.user.profileImg = avatarRes.url
  }
  resetPreviews()
  emit('update')
}

function onSubmit (): void {
  $handleLoading(useSubmit, {
    toast: {
      instance: toast
    }
  })
}
</script>
