<template>
  <Card
    class="w-full"
    pt:body:class="p-2 bg-slate-800 text-white rounded-lg border-none">
    <template #content>
      <div class="flex flex-col justify-center items-center">
        <div class="mb-1">
          <OverlayBadge>
            <Avatar
              :image="value.profileImg ?? undefined"
              :image-alt="value.username"
              icon="pi pi-user"
              size="xlarge" />
          </OverlayBadge>
        </div>
        <p class="text-xs">
          {{ value.username }}
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { IUserList } from '~/models/response/UserRes.model'
import Avatar from '~/volt/Avatar.vue'
import OverlayBadge from '~/volt/OverlayBadge.vue'

defineProps<{
  value: IUserList
}>()
</script>

<style scoped>

</style>
