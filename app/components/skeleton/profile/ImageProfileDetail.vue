<template>
  <div class="relative w-full">
    <img
      :src="value.bannerImg ? imageBaseUrl + value.bannerImg : '/png/upload-banner.png'"
      class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl">
  </div>
  <div class="flex -mt-14 px-4">
    <div class="relative w-24 h-24">
      <img
        :src="value.profileImg ? imageBaseUrl + value.profileImg : '/png/upload-profile.png'"
        class="w-24 h-24 rounded-full border-4 border-surface-0 object-cover">
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

defineProps<{
  value: IFindOneCurrentUserData
}>()
</script>

<style scoped>

</style>
