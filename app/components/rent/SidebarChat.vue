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
    <div class="flex-1 min-h-0 md:flex-none md:h-[calc(var(--app-height,100dvh)-230px)] overflow-y-auto overscroll-y-contain pr-1 pb-[calc(env(safe-area-inset-bottom)+5rem)] sm:pb-0 scrollbar-thin">
      <div class="grid gap-2">
        <ConversationRent
          v-for="(conversation, index) in conversationsRent"
          :key="`conversation-${index}`"
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
import type { IRentAPostData } from '~/models/response/RentRes.model'
import type { IRentCustomerProvider } from '~/resource/provider/RentCustomer.provider'
import RentCustomerProvider from '~/resource/provider/RentCustomer.provider'

const router = useRouter()
const { pagination, extractPagination } = usePagination()
const { $handleLoading } = useNuxtApp()
const conversationsRent = useState<IRentAPostData[]>('conversationsRent', (): IRentAPostData[] => [])


const rentCustomerProvider: IRentCustomerProvider = new RentCustomerProvider()

async function useFetch (): Promise<void> {
  const response = await rentCustomerProvider.findAllConversationSessionsPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  })

  conversationsRent.value = response.data || []
  pagination.value = extractPagination(response)
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
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
