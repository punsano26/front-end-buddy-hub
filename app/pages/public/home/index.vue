<template>
  <div>
    <Card
      pt:root:class="bg-gradient-to-r from-sky-950 to-cyan-950 rounded-none"
    >
      <template #content>
        <div class="p-6 flex flex-col gap-4 justify-center items-center">
          <div class="flex gap-1">
            <p class="font-bold text-3xl text-white">ค้นหาเพื่อนรักของ</p>
            <p
              class="font-bold text-3xl bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent"
            >
              คุณ
            </p>
          </div>
          <p class="text-sm text-surface-300 sm:text-xl mx-auto text-center">
            พบกับความแปลกใหม่และสังคมใหม่ๆที่ทุกคนในนี้ต่างเฝ้ารอที่จะคุยและสนุกกับคุณ
          </p>
          <div
            class="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
          >
            <InputSearch
              v-model="search"
              @search="onSearch()"
              class="w-full md:w-xs max-w-lg"
            />
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <Badge severity="success" />
               <span class="text-white">{{ onlineCount }} ออนไลน์</span>
              </div>
              <div class="flex items-center gap-2">
                <img
                  src="/svg/solar--user-circle-linear.svg"
                  alt="User Icon"
                  class="w-5 h-5"
                />
                <span class="text-white font-bold">{{ memberCountIncludeSelf }}</span>
                <span class="text-white">สมาชิก</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  <div class="px-4 mt-4 flex justify-start">
 <UserFilter
  v-model:gender="sortByGender"
  v-model:minAge="minAge"
  v-model:maxAge="maxAge"
  @change="onFilterChange()" />
</div>
    <div class="p-4 grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4">
      <DataLoadingState :is-loading="isLoading">
        <template #skeleton>
          <UserCardSkeleton v-for="i in 12" :key="`skeleton-${i}`" />
        </template>
        
        <UserCard
          v-for="item in mergedItems"
          :key="item.id"
          :value="item"
          @click="onClickUser(item.id)"
/>
      </DataLoadingState>
    </div>

    <div class="flex justify-center">
      <Paginate v-model="pagination" @page="fetch()" />
    </div>

    <UserDetailDialog
      v-if="details"
      v-model:visible="visible"
      :value="details"
    />
  </div>
</template>

<script setup lang="ts">
import InputSearch from '~/components/input/InputSearch.vue'
import DataLoadingState from '~/components/skeleton/DataLoadingState.vue'
import UserCardSkeleton from '~/components/skeleton/home/UserCardSkeleton.vue'
import Paginate from '~/components/user/Paginate.vue'
import UserCard from '~/components/user/UserCard.vue'
import UserDetailDialog from '~/components/user/UserDetailDialog.vue'
import UserFilter from '~/components/user/UserFilter.vue'
import { genderEnum } from '~/models/enums/User.enum'
import type { IFindOneCurrentUserData, IUserList } from '~/models/response/UserRes.model'
import type { IUserProvider } from '~/resource/provider/User.provider'
import UserProvider from '~/resource/provider/User.provider'
import { useAuthStore } from '~/stores/Auth'
import { useUserStore } from '~/stores/User'
import Card from '~/volt/Card.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const safeUsers = computed(() => Array.isArray(userStore.users) ? userStore.users : [])
const isSocketDriven = ref<boolean>(false)
const socketItems = computed<IUserList[]>(() => {
  return safeUsers.value
    .map((user): IUserList | null => {
      if (typeof user?.id !== 'number' || typeof user?.username !== 'string') return null
      return {
        id: user.id,
        username: user.username,
        nickname: user.nickname ?? null,
        profileImg: user.profileImg ?? null,
        isOnline: user.isOnline ?? false,
        gender: user.gender ?? '',
        dateOfBirth: user.dateOfBirth ?? ''
      }
    })
    .filter((item): item is IUserList => item !== null)
})

const mergedItems = computed(() => {
  return items.value
    .map(item => {
      const realtimeUser = safeUsers.value.find(u => u.id === item.id)
      return { ...item, isOnline: realtimeUser?.isOnline ?? item.isOnline ?? false }
    })
})
const memberCountIncludeSelf = computed(() => {
  return mergedItems.value.length + (authStore.user.id > 0 ? 1 : 0)
})
const onlineCount = computed(() => mergedItems.value.filter(item => item.isOnline).length)
const visible = ref(false);
const userService: IUserProvider = new UserProvider();
const { $handleLoading, $ws } = useNuxtApp();
const { search, pagination, extractPagination } = usePagination();
definePageMeta({ layout: "navbar" });
const items = ref<IUserList[]>([]);
const details = ref<IFindOneCurrentUserData>();
const sortByGender = ref<genderEnum | null>(null);
const minAge = ref<number>();
const maxAge = ref<number>();
const isLoading = ref<boolean>(true);

function getAgeFromDateOfBirth(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null

  const birthday = new Date(dateOfBirth)
  if (Number.isNaN(birthday.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const monthDiff = today.getMonth() - birthday.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age -= 1
  }

  return age
}

function getFilteredSocketItems(): IUserList[] {
  const searchValue = search.value.trim().toLowerCase()

  return socketItems.value.filter((item) => {
    const nickname = item.nickname?.toLowerCase() ?? ''
    const username = item.username.toLowerCase()
    const genderMatched = !sortByGender.value || item.gender === sortByGender.value
    const age = getAgeFromDateOfBirth(item.dateOfBirth)
    const minAgeMatched = minAge.value === undefined || (age !== null && age >= minAge.value)
    const maxAgeMatched = maxAge.value === undefined || (age !== null && age <= maxAge.value)
    const searchMatched = !searchValue || nickname.includes(searchValue) || username.includes(searchValue)

    return genderMatched && minAgeMatched && maxAgeMatched && searchMatched
  })
}

function applySocketPagination(): void {
  const filtered = getFilteredSocketItems()
  const page = pagination.value.page
  const limit = pagination.value.limit
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  items.value = filtered.slice(startIndex, endIndex)
  pagination.value.totalRecords = filtered.length
  pagination.value.count = filtered.length
  pagination.value.totalPage = Math.max(1, Math.ceil(filtered.length / limit))
}

function requestUsersViaSocket(timeoutMs = 1200): Promise<boolean> {
  const socket = $ws()
  if (!socket || socket.readyState !== WebSocket.OPEN) return Promise.resolve(false)

  return new Promise((resolve) => {
    let isDone = false
    const requestId = `users-${Date.now()}-${Math.random().toString(36).slice(2)}`

    const cleanup = (): void => {
      socket.removeEventListener('message', onMessage)
    }

    const done = (value: boolean): void => {
      if (isDone) return
      isDone = true
      cleanup()
      resolve(value)
    }

    const onMessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data)
        const isUsersEvent = data?.event === 'users:update'
          || data?.event === 'users:list'
          || data?.event === 'users:paginate:response'

        if (!isUsersEvent) return
        done(true)
      } catch {
        done(false)
      }
    }

    socket.addEventListener('message', onMessage)

    socket.send(JSON.stringify({
      event: 'users:paginate',
      requestId,
      data: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: search.value,
        sortByGender: sortByGender.value || undefined,
        minAge: minAge.value,
        maxAge: maxAge.value
      }
    }))

    setTimeout(() => done(false), timeoutMs)
  })
}

function requestUserDetailViaSocket(userId: number, timeoutMs = 1000): Promise<boolean> {
  const socket = $ws()
  if (!socket || socket.readyState !== WebSocket.OPEN) return Promise.resolve(false)

  return new Promise((resolve) => {
    let isDone = false
    const requestId = `user-detail-${userId}-${Date.now()}`

    const cleanup = (): void => {
      socket.removeEventListener('message', onMessage)
    }

    const done = (value: boolean): void => {
      if (isDone) return
      isDone = true
      cleanup()
      resolve(value)
    }

    const onMessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data)
        const detail = data?.data?.user ?? data?.user ?? data?.data

        if ((data?.event === 'user:detail' || data?.event === 'user:detail:response' || data?.event === 'users:detail:update') && detail?.id === userId) {
          done(true)
        }
      } catch {
        done(false)
      }
    }

    socket.addEventListener('message', onMessage)
    socket.send(JSON.stringify({ event: 'user:detail:get', requestId, data: { id: userId } }))
    setTimeout(() => done(false), timeoutMs)
  })
}

async function useFetchApi(): Promise<void> {
  const response = await userService.findAllUsersPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit,
    search: search.value,
    sortByGender: sortByGender.value || undefined,
    minAge: minAge.value,
    maxAge: maxAge.value
  });

  items.value = response?.data || [];
  pagination.value = extractPagination(response);
}

async function useFetchDetails(userId: number): Promise<void> {
  const response = await userService.findOneUserById(userId);
  details.value = response?.data;
}

async function useFetchDetailsSocketFirst(userId: number): Promise<void> {
  const cached = userStore.getUserDetail(userId)
  if (cached) {
    details.value = cached
    return
  }

  await requestUserDetailViaSocket(userId)
  const socketDetail = userStore.getUserDetail(userId)

  if (socketDetail) {
    details.value = socketDetail
    return
  }

  await useFetchDetails(userId)
}

function onClickUser(userId: number): void {
  $handleLoading(async () => {
    await useFetchDetailsSocketFirst(userId);
    visible.value = true;
  });
}

async function trySocketFirstFetch(): Promise<boolean> {
  if (socketItems.value.length > 0) {
    isSocketDriven.value = true
    applySocketPagination()
    return true
  }

  const isSocketUpdated = await requestUsersViaSocket()

  if (isSocketUpdated && socketItems.value.length > 0) {
    isSocketDriven.value = true
    applySocketPagination()
    return true
  }

  return false
}

function fetch(): void {
  $handleLoading(async () => {
    const isSocketSuccess = await trySocketFirstFetch()

    if (isSocketSuccess) return

    isSocketDriven.value = false
    await useFetchApi()
  }, { loadingUnit: isLoading });
}

onMounted((): void => {
  fetch();
});

function onSearch(): void {
  pagination.value.page = 1;
  fetch();
}

function onFilterChange(): void {
  pagination.value.page = 1
  fetch()
}

watch(() => safeUsers.value, () => {
  if (!isSocketDriven.value) return
  applySocketPagination()
}, { deep: true })
</script>

<style scoped></style>
