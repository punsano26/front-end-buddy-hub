<template>
  <Card class="transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01]">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            :src="props.value.profileImg || '/png/upload-profile.png'"
            alt="Avatar-friends"
            class="h-12 w-12 rounded-md object-cover">
          <div class="flex flex-col">
            <h3 class="text-lg font-bold">
              {{ props.value.username }}
            </h3>
            <div class="flex gap-2 items-center">
              <OverlayBadge
                v-if="props.value.isOnline"
                :severity="props.value.isOnline ? 'success' : 'danger'"
                size="large" />
              <p class="text-sm text-gray-500">
                {{ props.value.isOnline ? 'ออนไลน์' : `ใช้งานเมื่อ ${dayjs(props.value.lastOnlineAt).fromNow()}` }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Button
            label="ข้อความ"
            pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
            size="small"
            @click="onClickGoChatRoom" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const router = useRouter()
const props = defineProps<{
  value: {
    id: number
    profileImg: string
    isOnline: boolean
    username: string
    nickname: string
    lastOnlineAt: string
  }
}>()

function onClickGoChatRoom (): void {
  router.push({ name: 'public-chat-id', params: { id: props.value.id } })
}
</script>

<style scoped>

</style>
