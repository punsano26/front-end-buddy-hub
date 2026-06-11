<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden p-4 bg-white dark:bg-black transition-colors duration-200">
    <div class="flex justify-between items-center shrink-0 mb-3">
      <div class="flex items-center">
        <i class="pi pi-users text-blue-500 dark:text-blue-400 mr-2 text-lg" />
        <h2 class="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          เช่าเพื่อนคุย
        </h2>
      </div>
      <Button
        class="text-blue-500 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 border-none p-1.5"
        size="small"
        variant="text"
        @click="router.push({ name: 'public-rent-chat' })">
        สำรวจทั้งหมด
      </Button>
    </div>

    <!-- Search input -->
    <InputSearch
      class="w-full shrink-0 mb-3"
      placeholder="ค้นหาชื่อ ความเชี่ยวชาญ..." />

    <!-- Scrollable conversation list -->
    <div class="flex-1 min-h-0 overflow-y-auto overscroll-y-contain pr-1 pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0">
      <div class="grid gap-2">
        <ConversationRent
          v-for="conversation in conversationsRent"
          :key="conversation.id"
          :conversation="conversation" />
      </div>
      <p
        v-if="conversationsRent.length === 0"
        class="px-2 py-4 text-sm text-gray-500 text-center">
        ไม่มีเพื่อนคุยที่เลือก
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ConversationRent from '~/components/rent/ConversationRent.vue'

const router = useRouter()

// Rich mockup data representing various rent partners
const conversationsRent = ref<any[]>([
  {
    id: 1,
    nickname: 'น้องนุ่น (Smile Partner)',
    username: 'noon_smile',
    profileImg: null,
    status: 'online',
    rating: '4.9',
    rate: '30',
    lastMessageText: 'ยินดีรับฟังทุกเรื่องเลยค่ะ สบายใจขึ้นไหมคะ?',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 5) // 5 mins ago
  },
  {
    id: 2,
    nickname: 'พี่นัท (Life Coach)',
    username: 'nut_coach',
    profileImg: null,
    status: 'online',
    rating: '5.0',
    rate: '30',
    lastMessageText: 'เรื่องงานลองจัดสรรเวลาแบบใหม่ดูนะครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
  },
  {
    id: 3,
    nickname: 'มินนี่ (Gamer Buddy)',
    username: 'minnie_game',
    profileImg: null,
    status: 'idle',
    rating: '4.8',
    rate: '40',
    lastMessageText: 'คืนนี้มาลงแรงค์กันต่อไหมคะ เดี๋ยวซัพพอร์ตให้เอง!',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    id: 4,
    nickname: 'เจมส์ (Cafe Hopper)',
    username: 'james_cafe',
    profileImg: null,
    status: 'online',
    rating: '4.9',
    rate: '60',
    lastMessageText: 'ร้านกาแฟเปิดใหม่แถวอารีย์บรรยากาศดีมากครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 360) // 6 hours ago
  }
])
</script>

<script lang="ts">
// Explicit component registration to avoid resolving issues
export default {
  name: 'SidebarChat'
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--p-surface-300);
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-400);
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: var(--p-surface-700);
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: var(--p-surface-600);
}
</style>
