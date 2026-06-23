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
        @click="checkRentPostAlreadyExists"
        :label="rentStore.rentPostAlreadyExists?.data?.hasPost ? 'แก้ไขเช่ารับฟัง' : 'เปิดเช่ารับฟัง'"
        :icon="rentStore.rentPostAlreadyExists?.data?.hasPost ? 'pi pi-pencil' : 'pi pi-plus'"
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
      <RentCard v-for="(item, index) in rentStore.posts" :key="index" :item="item" @rent="selectRentPost(item.id)" />
    </div>
  </div>
  <RentModal :item="rentStore.selectedPost" :wallet-balance="myWalletBalance" v-model:visible="rentModalVisible" @confirm="confirmRent" />
  <SuccessHireModal
    v-model:visible="successModalVisible"
    :item="successModalItem"
    :duration-minutes="successModalDuration"
    :coin-cost="successModalCost"
    @chat="goToChatPage" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import RentModal from '@/components/rent/RentModal.vue'
import SuccessHireModal from '@/components/rent/SuccessHireModal.vue'
import { useToast } from 'primevue/usetoast'
import type { IRentAPostPayload } from '~/models/request/RentReq.model'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindWalletBalanceData } from '~/models/response/WallRes.model'
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'
import RentCustomerProvider, { type IRentCustomerProvider } from '~/resource/provider/RentCustomer.provider'
import WalletProvider, { type IWalletProvider } from '~/resource/provider/Wallet.provider'
import { useRentStore } from '~/stores/Rent'

const router = useRouter()
const rentModalVisible = ref(false)
const successModalVisible = ref(false)
const successModalDuration = ref(15)
const successModalCost = ref(0)
const successModalItem = ref<IFindAllRentPostList | null>(null)

const { $handleLoading } = useNuxtApp()
const toast = useToast()
const myWalletBalance = ref<IFindWalletBalanceData>({ userId: 0, balance: 0 })
const { pagination, extractPagination } = usePagination()
const rentStore = useRentStore()
const walletService: IWalletProvider = new WalletProvider()
const rentCustomerService: IRentCustomerProvider = new RentCustomerProvider()
const conversationsRent = useState<any[]>('conversationsRent', (): any[] => [])

async function useFetch (): Promise<void> {
  const paginationResult = await rentStore.fetchPosts({
    page: pagination.value.page,
    limit: pagination.value.limit
  })
  pagination.value = extractPagination(paginationResult)
  await rentStore.checkRentPostAlreadyExists()
}

function fetch (): void {
  $handleLoading(useFetch)
}

async function onSelectedRentPost (id: TBaseParamsId): Promise<void> {
  await rentStore.fetchPostById(id)
  rentModalVisible.value = true
}

function selectRentPost (id: TBaseParamsId): void {
  $handleLoading(() => onSelectedRentPost(id))
}

async function onCheckRentPostAlreadyExists (): Promise<void> {
  const response = await rentStore.checkRentPostAlreadyExists()
  if (response?.data?.hasPost) {
    router.push({ name: 'public-rent-my-post' })
  } else {
    router.push({ name: 'public-rent-create' })
  }
}

function checkRentPostAlreadyExists (): void {
  $handleLoading(onCheckRentPostAlreadyExists)
}

async function onGetMyWalletBalance (): Promise<void> {
  const response = await walletService.findWalletBalance()
  myWalletBalance.value = response?.data || { userId: 0, balance: 0 }
}

function getMyWalletBalance (): void {
  $handleLoading(onGetMyWalletBalance)
}

function goToChatPage (): void {
  if (!successModalItem.value) return
  router.push({ name: 'public-rent-chat-id', params: { id: successModalItem.value.provider.id } })
}

async function onConfirmRent (payload: IRentAPostPayload): Promise<void> {
  if (!rentStore.selectedPost) return
  const provider = rentStore.selectedPost.provider

  await rentCustomerService.rentAPost(payload)

  myWalletBalance.value.balance -= payload.durationMinutes * rentStore.selectedPost.coinRatePerMinute

  const existing = conversationsRent.value?.find((c: any): boolean => c.id === provider.id)
  if (existing) {
    existing.sessionStatus = 'pending'
    existing.maxDurationMinutes = payload.durationMinutes
  } else {
    conversationsRent.value?.unshift({
      id: provider.id,
      nickname: provider.nickname || provider.username,
      username: provider.username,
      profileImg: provider.profileImg,
      status: provider.isOnline ? 'online' : 'offline',
      category: rentStore.selectedPost.category?.name || 'เพื่อนคุย',
      rating: String(provider.rating?.averageRating || '5.0'),
      rate: String(rentStore.selectedPost.coinRatePerMinute),
      rateHour: String(rentStore.selectedPost.coinRatePerMinute * 60),
      lastMessageText: 'ส่งคำขอเช่าคุยแล้ว รอการตอบรับ...',
      lastMessageCreatedAt: new Date(),
      welcomeMessage: rentStore.selectedPost.description || 'สวัสดีค่ะ ยินดีต้อนรับนะคะ!',
      sessionStatus: 'pending',
      maxDurationMinutes: payload.durationMinutes
    })
  }

  successModalDuration.value = payload.durationMinutes
  successModalCost.value = payload.durationMinutes * rentStore.selectedPost.coinRatePerMinute
  successModalItem.value = rentStore.selectedPost
  
  rentModalVisible.value = false
  successModalVisible.value = true
}

function confirmRent (payload: IRentAPostPayload): void {
  $handleLoading(() => onConfirmRent(payload), {
    toast: {
      instance: toast
    }
  })
}


onMounted((): void => {
  fetch()
  getMyWalletBalance()
})
</script>


<style></style>

