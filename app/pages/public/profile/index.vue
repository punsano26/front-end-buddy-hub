<template>
  <div class="flex justify-center items-center py-10 px-8">
    <Card pt:root:class="md:w-[600px] w-full">
      <template #header>
        <UploadImageProfile :value="items" @update="fetch" />
      </template>
      <template #content>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-2">
            <p class="text-xl font-bold">
              {{ items?.username }} - {{ items?.nickname }}
            </p>
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
                  :class="chageIconGender"
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
          <div>
            <Button
              @click="visible = true"
              class="min-w-[110px] text-sm font-bold w-full"
              pt:root:class="border-none justify-center px-2 rounded-xl"
            >
              แก้ไขโปรไฟล์
            </Button>
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
    <UserEditDetailDialog
      :value="items"
      v-model:visible="visible"
      @updated="fetch"
    />
  </div>
</template>

<script setup lang="ts">
import UploadImageProfile from '~/components/input/UploadImageProfile.vue'
import UserEditDetailDialog from '~/components/user/UserEditDetailDialog.vue'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import UserProvider, { type IUserProvider } from '~/resource/provider/User.provider'

definePageMeta({ layout: "navbar" });
const visible = ref(false);
const userService: IUserProvider = new UserProvider();
const { $handleLoading } = useNuxtApp();
const dayjs = useDayjs();
const items = ref<IFindOneCurrentUserData>();

const chageIconGender = computed(() => {
  if (items.value?.gender === "male") {
    return "pi pi-mars";
  } else if (items.value?.gender === "female") {
    return "pi pi-venus";
  } else {
    return "pi pi-genderless";
  }
});

async function useFetch(): Promise<void> {
  const response = await userService.findOneCurrentUser();
  items.value = response?.data;
}

function fetch(): void {
  $handleLoading(useFetch);
}

onMounted(() => {
  fetch();
});
</script>

<style scoped></style>
