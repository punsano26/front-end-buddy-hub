<template>
  <div class="h-full flex flex-col min-h-0 overflow-hidden p-4 bg-white dark:bg-black transition-colors duration-200">
    <!-- Header -->
    <div class="flex justify-between items-center shrink-0 mb-3">
      <div class="flex items-center">
        <i class="pi pi-users text-blue-500 dark:text-blue-400 mr-2 text-lg" />
        <h2 class="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          เช่าเพื่อนคุย
        </h2>
      </div>
      <button
        class="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg px-2.5 py-1.5 font-medium transition-colors duration-150"
        type="button"
        @click="router.push({ name: 'public-rent-chat' })">
        สำรวจทั้งหมด
      </button>
    </div>

    <!-- Search input -->
    <InputSearch
      class="w-full shrink-0 mb-3"
      placeholder="ค้นหาชื่อ ความเชี่ยวชาญ..." />

    <!-- Scrollable conversation list -->
    <div class="flex-1 min-h-0 overflow-y-auto overscroll-y-contain pr-1 pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0 scrollbar-thin">
      <div class="grid gap-2">
        <ConversationRent
          v-for="conversation in conversationsRent"
          :key="conversation.id"
          :conversation="conversation" />
      </div>
      <p
        v-if="conversationsRent.length === 0"
        class="px-2 py-4 text-sm text-slate-500 text-center">
        ไม่มีเพื่อนคุยที่เลือก
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ConversationRent from '~/components/rent/ConversationRent.vue'

const router = useRouter()

// Rich mockup data representing various rent partners, shared via Nuxt useState
const conversationsRent = useState<any[]>('conversationsRent', (): any[] => [
  {
    id: 1,
    nickname: 'น้องนุ่น (Smile Partner)',
    username: 'noon_smile',
    profileImg: null,
    status: 'online',
    category: 'ผู้รับฟังที่ดี',
    rating: '4.9',
    rate: '30',
    rateHour: '120',
    lastMessageText: 'ยินดีรับฟังทุกเรื่องเลยค่ะ สบายใจขึ้นไหมคะ?',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    welcomeMessage: 'สวัสดีค่ะพี่ ยินดีต้อนรับนะคะ! วันนี้มีเรื่องอะไรไม่สบายใจ หรืออยากเล่าให้ฟังเป็นพิเศษไหมคะ? นุ่นพร้อมฟังและอยู่เคียงข้างพี่เสมอค่ะ',
    sessionStatus: 'active',
    maxDurationMinutes: 180
  },
  {
    id: 2,
    nickname: 'พี่นัท (Life Coach)',
    username: 'nut_coach',
    profileImg: null,
    status: 'online',
    category: 'ที่ปรึกษา',
    rating: '5.0',
    rate: '30',
    rateHour: '150',
    lastMessageText: 'เรื่องงานลองจัดสรรเวลาแบบใหม่ดูนะครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    welcomeMessage: 'สวัสดีครับ! ยินดีที่ได้คุยกันนะ วันนี้อยากปรึกษาเรื่องอะไรเป็นพิเศษครับ? ไม่ว่าจะเป็นเรื่องงาน ความคิด หรือทิศทางชีวิต พี่พร้อมช่วยซัพพอร์ตครับ',
    sessionStatus: 'active',
    maxDurationMinutes: 120
  },
  {
    id: 3,
    nickname: 'เจ**ส์',
    username: 'เจ**ส์',
    profileImg: null,
    status: 'idle',
    category: 'เพื่อนเล่นเกม',
    rating: '4.8',
    rate: '40',
    rateHour: '100',
    lastMessageText: 'คืนนี้มาลงแรงค์กันต่อไหมคะ เดี๋ยวซัพพอร์ตให้เอง!',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 120),
    welcomeMessage: 'หวัดดีค่า! พร้อมตี้หรือยังคะ? คืนนี้จะเล่นเกมอะไรดี ลุยไปด้วยกันนะ เดี๋ยวหนูแบกเอง (หรือให้พี่แบกดีนะ ฮ่าๆ)',
    sessionStatus: 'finished',
    maxDurationMinutes: 240
  },
  {
    id: 4,
    nickname: 'เจ**ส์',
    username: 'เจ**ส์',
    profileImg: null,
    status: 'online',
    rating: '4.9',
    rate: '60',
    rateHour: '130',
    lastMessageText: 'ร้านกาแฟเปิดใหม่แถวอารีย์บรรยากาศดีมากครับ',
    lastMessageCreatedAt: new Date(Date.now() - 1000 * 60 * 360),
    welcomeMessage: 'สวัสดีครับพี่! วันนี้อยากหาเพื่อนคุยสไตล์เที่ยวชิลๆ หรือแชร์ร้านคาเฟ่ลับๆ ดีครับ? มีพิกัดเจ๋งๆ แนะนำเพียบเลย!',
    sessionStatus: 'active',
    maxDurationMinutes: 180
  }
])
</script>

<script lang="ts">
export default {
  name: 'SidebarChat'
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(203 213 225); /* slate-300 */
  border-radius: 4px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184); /* slate-400 */
}
:is(.dark) .scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(51 65 85); /* slate-700 */
}
:is(.dark) .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(71 85 105); /* slate-600 */
}
</style>
