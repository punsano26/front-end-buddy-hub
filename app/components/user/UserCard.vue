<template>
  <Card
    class="w-full"
    pt:body:class="p-2 rounded-lg border-none dark:bg-surface-900 bg-surface-100">
    <template #content>
      <div class="flex flex-col justify-center items-center">
        <div class="mb-1">
          <OverlayBadge
            :show="value.isOnline"
            :size="'large'"
            pt:badge:class="`rounded-full`"
            severity="success">
            <ClientOnly>
              <Avatar
                :image="value.profileImg ? imageBaseUrl + value.profileImg : '/png/upload-profile.png'"
                :image-alt="value.username"
                pt:image:class="rounded-lg p-circle:rounded-lg p-xlarge:rounded-lg w-full h-full object-cover"
                size="xlarge" />
            </ClientOnly>
          </OverlayBadge>
        </div>
        <p class="text-xs flex items-center gap-1">
          {{ value.nickname || value.username }}
          <span
            v-if="value.isBanned"
            class="px-1.5 py-0.5 text-[9px] text-white bg-red-500 rounded shrink-0 font-bold">ถูกระงับ</span>
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { IUserList } from '~/models/response/UserRes.model'
import Avatar from '~/volt/Avatar.vue'
import OverlayBadge from '~/volt/OverlayBadge.vue'

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

defineProps<{
  value: IUserList
}>()
</script>

<style scoped></style>
