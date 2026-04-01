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
                <span class="text-white">14 ออนไลน์</span>
              </div>
              <div class="flex items-center gap-2">
                <img
                  src="/svg/solar--user-circle-linear.svg"
                  alt="User Icon"
                  class="w-5 h-5"
                />
                <span class="text-white font-bold">1,234</span>
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
          v-for="item in items"
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
import Card from '~/volt/Card.vue'

const visible = ref(false);
const userService: IUserProvider = new UserProvider();
const { $handleLoading } = useNuxtApp();
const { search, pagination, extractPagination } = usePagination();
definePageMeta({ layout: "navbar" });
const items = ref<IUserList[]>([]);
const details = ref<IFindOneCurrentUserData>();
const sortByGender = ref<genderEnum | null>(null);
const minAge = ref<number>();
const maxAge = ref<number>();
const isLoading = ref<boolean>(true);

async function useFetch(): Promise<void> {
  
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

function onClickUser(userId: number): void {
  $handleLoading(async () => {
    await useFetchDetails(userId);
    visible.value = true;
  });
}

function fetch(): void {
  $handleLoading(useFetch, { loadingUnit: isLoading });
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
</script>

<style scoped></style>
