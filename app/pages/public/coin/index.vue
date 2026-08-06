<template>
  <div class="mx-auto max-w-5xl px-4 py-8 space-y-10 sm:px-6">
    <CoinPackages :items="items" />
    <TransactionCoinHistory />
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