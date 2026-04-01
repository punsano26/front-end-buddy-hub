<template>
  <div class="flex justify-center items-center py-10 px-8">
    <DataLoadingState :is-loading="isLoading">
      <template #skeleton>
        <MyProfilePageSkeleton />
      </template>

      <Card pt:root:class="md:w-[600px] w-full">
        <template #header>
          <ImageProfileDetail v-if="items" :value="items" />
        </template>
        <template #content>
          <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-2">
            <div class="flex flex-col gap-2 flex-1 min-w-0">
              <div class="flex gap-2 items-center">
                <p class="text-xl font-bold">
                  {{ items?.username }} - {{ items?.nickname }}
                </p>
                <i v-if="items?.isVerified === true" class="pi pi-verified text-green-400"></i>
              </div>
              <p class="text-sm text-surface-500">
                {{ items?.description }}
              </p>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2"
              >
                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-clock text-surface-500 shrink-0" />
                  <span class="text-xs text-surface-400 shrink-0">join</span>
                  <p class="text-sm text-surface-500 truncate">
                    {{ dayjs(items?.createdAt).format("DD/MM/YYYY") }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-envelope text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ items?.email }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i
                    :class="changeIconGender"
                    :style="{
                      color:
                        items?.gender === 'male'
                          ? '#3b82f6'
                          : items?.gender === 'female'
                            ? '#ec4899'
                            : '#6b7280',
                    }"
                    class="shrink-0"
                  />
                  <p class="text-sm text-surface-500 truncate capitalize">
                    {{ items?.gender }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-calendar text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ dayjs(items?.dateOfBirth).format("DD/MM/YYYY") }}
                  </p>
                </div>

                <div class="flex gap-1 items-center min-w-0">
                  <i class="pi pi-heart text-surface-500 shrink-0" />
                  <p class="text-sm text-surface-500 truncate">
                    {{ items?.age }}
                  </p>
                </div>
              </div>
            </div>
            <div class="w-full md:w-28 md:shrink-0 md:pt-1">
              <div class="grid grid-cols-1 gap-2">
                <Button
                  size="small"
                  class="w-full bg-linear-to-r from-sky-500 to-pink-600 border-none text-black! enabled:hover:from-sky-600 enabled:hover:to-pink-700 active:from-sky-400 active:to-pink-500"
                >
                <i class="pi pi-user-plus"></i>
                  เพิ่มเพื่อน
                </Button>
                <Button
                  size="small"
                  class="w-full bg-gray-800! dark:text-white border-none enabled:hover:bg-gray-900"
                >
                  <i class="pi pi-comments"></i>
                  แชท
                </Button>
                <Button
                  size="small"
                  pt:root:class="w-full bg-transparent border-none text-red-500 enabled:hover:bg-red-500/10 enabled:hover:text-red-700 enabled:active:bg-red-500/20 active:text-red-700"
                >
                  <i class="pi pi-flag"></i>
                  รายงาน
                </Button>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <Divider />
          <div class="flex justify-center gap-24">
            <div class="flex flex-col">
              <p class="font-bold text-center">0</p>
              <p class="text-sm text-surface-500">เพื่อน</p>
            </div>
            <div class="flex flex-col">
              <p class="font-bold text-center">0</p>
              <p class="text-sm text-surface-500">แชท</p>
            </div>
          </div>
        </template>
      </Card>
    </DataLoadingState>

    <UserEditDetailDialog
      :value="items"
      v-model:visible="visible"
      @updated="fetch"
    />
  </div>
</template>

<script setup lang="ts">
import DataLoadingState from '~/components/skeleton/DataLoadingState.vue'
import ImageProfileDetail from '~/components/skeleton/profile/ImageProfileDetail.vue'
import MyProfilePageSkeleton from '~/components/skeleton/profile/MyProfilePageSkeleton.vue'
import UserEditDetailDialog from '~/components/user/UserEditDetailDialog.vue'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import UserProvider, { type IUserProvider } from '~/resource/provider/User.provider'

definePageMeta({ layout: "navbar" });
const visible = ref(false);
const userService: IUserProvider = new UserProvider();
const { $handleLoading } = useNuxtApp();
const dayjs = useDayjs();
const items = ref<IFindOneCurrentUserData>();
const isLoading = ref<boolean>(true);
const id = computed(() => Number(useRoute().params.id));

const changeIconGender = computed(() => {
  if (items.value?.gender === "male") {
    return "pi pi-mars";
  } else if (items.value?.gender === "female") {
    return "pi pi-venus";
  } else {
    return "pi pi-genderless";
  }
});

async function useFetchDetails(): Promise<void> {
  const response = await userService.findOneUserById(id.value);
  items.value = response?.data;
}

function fetch(): void {
  $handleLoading(useFetchDetails, { loadingUnit: isLoading });
}

onMounted(() => {
  fetch();
});
</script>

<style scoped></style>
