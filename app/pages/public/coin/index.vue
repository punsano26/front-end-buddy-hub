<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- Ambient background glow elements -->
    <div class="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/5" />
    <div class="pointer-events-none absolute top-1/3 left-[-10%] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
    <div class="pointer-events-none absolute bottom-10 right-[15%] h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5" />

    <div class="relative mx-auto max-w-5xl px-4 py-8 space-y-12 sm:px-6">
      <CoinPackages :items="items" />
      <TransactionCoinHistory />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CoinPackages from '~/components/subscription/CoinPackages.vue'
import TransactionCoinHistory from '~/components/subscription/TransactionCoinHistory.vue'
import type { ICoinList } from '~/models/response/CoinRes.model'
import CoinProvider, { type ICoinProvider } from '~/resource/provider/Coin.provider'

definePageMeta({
  layout: 'navbar'
})

useSeoMeta({
  title: 'กระเป๋าเหรียญ',
  description: 'จัดการเหรียญสำหรับเช่าคุย ส่งของขวัญ และปลดล็อกฟีเจอร์พิเศษ'
})


const CoinService: ICoinProvider = new CoinProvider()
const { $handleLoading } = useNuxtApp()
const { search, pagination, extractPagination } = usePagination()
const items = ref<ICoinList[]>([])

async function useFetch (): Promise<void> {
  const response = await CoinService.findAllCoinsPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit,
    search: search.value,
  })
  items.value = response?.data || []
  pagination.value = extractPagination(response)
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>