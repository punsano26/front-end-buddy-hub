<template>
  <Dialog
    v-model:visible="visible"
    class="sm:w-100 w-9/10"
    pt:content:class="p-0"
    pt:header:class="!absolute !top-2 !right-2 !z-30 !p-0 !m-0 !bg-transparent !border-0 !shadow-none"
    pt:headerActions:class="!m-0 !p-0 !flex"
    pt:root:class="!relative bg-surface-900! border-none rounded-xl shadow-lg"
    pt:title:class="hidden"
    dismissable-mask
    modal>
    <img
      :src="value.bannerImg || 'https://picsum.photos/seed/picsum/200/300'"
      alt="user banner"
      class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl">
    <div class="flex justify-center items-center gap-4 -mt-12 px-4">
      <img
        :src="value.profileImg || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
        alt="user avatar"
        class="w-24 h-24 rounded-full border-4 border-surface-0 object-cover">
    </div>
    <div class="flex flex-col items-center gap-2">
      <p class="text-xl text-white font-semibold">
        {{ value.nickname || value.username }}
      </p>
      <p
        class="text-xs text-surface-400 dark:text-surface-500 hover:text-surface-300 dark:hover:text-surface-400 cursor-pointer"
        @click="onClickUserDetail(value.id)">
        @{{ value.username }}
      </p>
      <p
        class="text-center mx-auto max-w-[280px] text-sm text-surface-500 dark:text-surface-400">
        {{ value.description || '-' }}
      </p>
    </div>
    <div class="flex justify-center items-center gap-2 mt-2 p-4">
      <Button
        :disabled="isSentRequest"
        class="w-full bg-gradient-to-r from-sky-500 to-pink-600 border-none text-black! enabled:hover:from-sky-600 enabled:hover:to-pink-700 active:from-sky-400 active:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed"
        @click="onClickAddFriend(value.id)">
        {{ isSentRequest ? 'ส่งคำขอแล้ว' : 'เพิ่มเพื่อน' }}
      </Button>
      <Button
        class="w-full bg-gray-800! border-none enabled:hover:bg-gray-900"
        @click="onClickToOpenChat(value.id)">
        แชท
      </Button>
      <Button pt:root:class="w-full bg-transparent border-none text-red-500 enabled:hover:bg-red-500/10 enabled:hover:text-red-700 enabled:active:bg-red-500/20 active:text-red-700">
        รายงาน
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'
import Dialog from '~/volt/Dialog.vue'

const friendService: IFriendProvider = new FriendProvider()
const visible = ref(false)
const router = useRouter()
const isSentRequest = ref(false)
const statusSentRequest = ref<'null' | 'pending' | 'accept'>('null')
defineProps<{
  value: IFindOneCurrentUserData
}>()

function onClickUserDetail (userId: number): void {
  router.push({ name: 'public-profile-id', params: { id: userId } })
}

function onClickToOpenChat (userId: number): void {
  router.push({ name: 'public-chat-id', params: { id: userId } })
}


const isSubmitting = ref(false)

async function onClickAddFriend (friendId: number): Promise<void> {
  if (isSubmitting.value || statusSentRequest.value !== 'null') return

  isSubmitting.value = true

  try {
    await friendService.sendAFriendRequest({ friendId })

    statusSentRequest.value = 'pending'
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>

</style>
