<template>
  <div>
    <div class="flex justify-between items-center">
      <div>
        <i class="pi pi-comment text-gray-500 mr-2" />
        <span class="text-gray-500">เช่าเพื่อนคุย</span>
      </div>
      <Button
        class="text-gray-500 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        size="sm"
        variant="text"
        @click="router.push({ name: 'public-rent-chat' })">
        สำรวจ
      </Button>
    </div>

    <InputSearch
      class="w-full mt-3 mb-2"
      placeholder="ค้นหาชื่อ ความเชี่ยวชาญ..." />

    <div class="flex-1 min-h-0 md:flex-none md:h-[calc(var(--app-height,100dvh)-230px)] overflow-y-auto overscroll-y-contain pr-1 pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0">
      <div class="grid gap-1">
        <ConversationRent
          v-for="conversation in conversationsRent"
          :key="conversation.id"
          :conversation="conversation" />
      </div>
      <p
        v-if="conversationsRent.length === 0"
        class="px-2 py-4 text-sm text-gray-500">
        No conversations yet.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const conversationsRent = ref<any[]>([
  {
    id: 1,
    nickname: 'เพื่อนคุย A',
    username: 'friendA',
    profileImg: null,
    type: 'chat',
    lastMessageText: 'สวัสดีครับ มีอะไรให้ช่วยไหม?',
    lastMessageCreatedAt: new Date()
  },
  {
    id: 2,
    nickname: 'เพื่อนคุย B',
    username: 'friendB',
    type: 'chat',
    profileImg: null,
    lastMessageText: 'วันนี้เป็นยังไงบ้าง?',
    lastMessageCreatedAt: new Date()
  },
  {
    id: 3,
    nickname: 'เพื่อนคุย C',
    username: 'friendC',
    type: 'emo',
    profileImg: null,
    lastMessageText: 'อยากคุยเรื่องอะไร?',
    lastMessageCreatedAt: new Date()
  }
])
const router = useRouter()
</script>

<style>

</style>
