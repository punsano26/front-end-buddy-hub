<template>
  <div
    class="flex flex-col gap-2 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
  >
    <h1 class="text-2xl font-bold sm:text-4xl">
      <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
        เช่าเพื่อนคุย
      </span>
    </h1>
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <p class="text-sm sm:max-w-2xl">
        เลือกเพื่อนคุยที่ใช่ — คุยเล่นสนุกๆ
        หรือปรึกษาปัญหาทางใจกับผู้รับฟังมืออาชีพ
      </p>
      <div class="flex gap-2">
      <Button 
        @click="router.push({ name: 'public-rent-chat' })"
        icon="pi pi-comments"
        pt:root:class="border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
        rounded  
      />
      <Button
      @click="isCreatePage"
        label="เปิดเช่ารับฟัง"
        icon="pi pi-plus"
        pt:root:class="bg-gradient-primary border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
        rounded
      />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_auto] sm:items-center">
      <InputSearch placeholder="ค้นหาชื่อ ความเชี่ยวชาญ..." class="w-full" />
      <SelectInput
        placeholder="เรตติ้งสูงสุด"
        pt:root:class="w-full sm:w-48 shadow-sm"
      />
    </div>
    <div class="flex justify-start">
      <RentFilter/>
    </div>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <RentCard v-for="(item, index) in items" :key="index" :item="item" @rent="selectRentPost(item.id)" />
    </div>
  </div>
  <RentModal :item="selectedRentPost" :wallet-balance="myWalletBalance" v-model:visible="rentModalVisible" @confirm="onConfirmRent" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import RentModal from '@/components/rent/RentModal.vue'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'
import type { IFindWalletBalanceData } from '~/models/response/WallRes.model'
import RentProvider, { type IRentProvider } from '~/resource/provider/Rent.provider'
import WalletProvider, { type IWalletProvider } from '~/resource/provider/Wallet.provider'

const router = useRouter()
const rentModalVisible = ref(false)
const { $handleLoading } = useNuxtApp()
const items = ref<IFindAllRentPostList[]>([])
const myWalletBalance = ref<IFindWalletBalanceData>({ userId: 0, balance: 0 })
const selectedRentPost = ref<IFindAllRentPostList | null>(null)
const { pagination, extractPagination } = usePagination()
const rentService: IRentProvider = new RentProvider()
const walletService: IWalletProvider = new WalletProvider()
const conversationsRent = useState<any[]>('conversationsRent')

async function useFetch (): Promise<void> {
  const response = await rentService.findAllRentPostsPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  })
  items.value = response?.data || []
  pagination.value = extractPagination(response?.pagination)
}

function fetch (): void {
  $handleLoading(useFetch)
}

async function onSelectedRentPost (id: TBaseParamsId): Promise<void> {
  const response = await rentService.findOneRentPostById(id)
  selectedRentPost.value = response?.data || null
  rentModalVisible.value = true
}

function selectRentPost (id: TBaseParamsId): void {
  $handleLoading(() => onSelectedRentPost(id))
}

async function onGetMyWalletBalance (): Promise<void> {
  const response = await walletService.findWalletBalance()
  myWalletBalance.value = response?.data || { userId: 0, balance: 0 }
}

function getMyWalletBalance (): void {
  $handleLoading(onGetMyWalletBalance)
}

function onConfirmRent (payload: { duration: number, cost: number }): void {
  if (!selectedRentPost.value) return
  const provider = selectedRentPost.value.provider

  myWalletBalance.value.balance -= payload.cost

  const existing = conversationsRent.value?.find((c: any): boolean => c.id === provider.id)
  if (existing) {
    existing.sessionStatus = 'active'
    existing.maxDurationMinutes = payload.duration
  } else {
    conversationsRent.value?.unshift({
      id: provider.id,
      nickname: provider.nickname || provider.username,
      username: provider.username,
      profileImg: provider.profileImg,
      status: provider.isOnline ? 'online' : 'offline',
      category: selectedRentPost.value.category?.name || 'เพื่อนคุย',
      rating: String(provider.rating?.averageRating || '5.0'),
      rate: String(selectedRentPost.value.coinRatePerMinute),
      rateHour: String(selectedRentPost.value.coinRatePerMinute * 60),
      lastMessageText: 'เริ่มเซสชันเช่าคุยแล้ว',
      lastMessageCreatedAt: new Date(),
      welcomeMessage: selectedRentPost.value.description || 'สวัสดีค่ะ ยินดีต้อนรับนะคะ!',
      sessionStatus: 'active',
      maxDurationMinutes: payload.duration
    })
  }

  rentModalVisible.value = false
  router.push({ name: 'public-rent-chat-id', params: { id: provider.id } })
}

function isCreatePage (): void {
  router.push({ name: 'public-rent-create' })
}

onMounted((): void => {
  fetch()
  getMyWalletBalance()
})
</script>


<style></style>

