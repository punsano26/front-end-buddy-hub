<template>
  <p class="text-sm">
    อัพโหลดรูปภาพโปรไฟล์
  </p>

  <!-- Banner -->
  <div class="relative w-full">
    <img
      :src="bannerPreview || '/png/upload-banner.png'"
      alt="user banner"
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
  <div class="flex justify-center items-center -mt-18 px-4">
    <div class="relative w-24 h-24">
      <img
        :src="avatarPreview || '/png/upload-profile.png'"
        alt="user avatar"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bannerInput = ref<HTMLInputElement | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)

const bannerPreview = ref<string>('')
const avatarPreview = ref<string>('')

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
</script>
