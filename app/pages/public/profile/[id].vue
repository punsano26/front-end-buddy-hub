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
                        items?.gender === genderEnum.MALE
                          ? '#3b82f6'
                          : items?.gender === genderEnum.FEMALE
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
                <template v-if="shouldShowFriendRequestActions">
                  <Button
                    :disabled="isSubmitting"
                    size="small"
                    class="w-full bg-linear-to-r from-emerald-500 to-green-600 border-none text-white enabled:hover:from-emerald-600 enabled:hover:to-green-700 active:from-emerald-400 active:to-green-500"
                    @click="onClickAcceptRequest"
                  >
                    <i class="pi pi-check"></i>
                    ยอมรับ
                  </Button>
                  <Button
                    size="small"
                    :disabled="isSubmitting"
                    class="w-full bg-linear-to-r from-red-500 to-rose-600 border-none text-white enabled:hover:from-red-600 enabled:hover:to-rose-700 active:from-red-400 active:to-rose-500"
                    @click="onClickRejectRequest"
                  >
                    <i class="pi pi-times"></i>
                    ปฏิเสธ
                  </Button>
                </template>
                <Button
                  v-else-if="isFriend"
                  size="small"
                  @click="clickRemoveFriend"
                  class="w-full bg-emerald-500/25 border-emerald-500/40 text-emerald-200"
                >
                  <i class="pi pi-check-circle"></i>
                  เพื่อน
                </Button>
                <Button
                  v-else-if="shouldShowAddFriendButton"
                  :disabled="isSubmitting || isFriendRequestSent"
                  @click="clickAddFriend"
                  size="small"
                  class="w-full bg-linear-to-r from-sky-500 to-pink-600 border-none text-black! enabled:hover:from-sky-600 enabled:hover:to-pink-700 active:from-sky-400 active:to-pink-500"
                >
                  <i
                    v-if="isSubmitting"
                    class="pi pi-spin pi-spinner text-black!"
                  />
                  <i
                    v-else-if="isFriendRequestSent"
                    class="pi pi-clock text-surface-500 shrink-0"
                  />
                  <i v-else class="pi pi-user-plus"></i>
                  {{
                    isFriendRequestSent ? "คำขอถูกส่งแล้ว" : "เพิ่มเป็นเพื่อน"
                  }}
                </Button>
                <Button
                  size="small"
                  class="w-full bg-gray-800! dark:text-white border-none enabled:hover:bg-gray-900"
                  @click="onClickToOpenChat"
                >
                  <i class="pi pi-comments"></i>
                  แชท
                </Button>
                <Button
                  size="small"
                  pt:root:class="w-full bg-transparent border-none text-red-500 enabled:hover:bg-red-500/10 enabled:hover:text-red-700 enabled:active:bg-red-500/20 active:text-red-700"
                  @click="isReportDialogVisible = true"
                >
                  <i class="pi pi-flag"></i>
                  รายงาน
                </Button>
              </div>
            </div>
            <ReportModalDialog v-model:visible="isReportDialogVisible" />
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
    <ConfirmModalDialog
      v-model:visible="dialogOpenConfirmRemoveFriends"
      confirm-button="ใช่, ฉันต้องการลบเพื่อน"
      message="คุณแน่ใจว่าต้องการลบเพื่อนหรือไม่?
      คุณจะต้องส่งคำขอเป็นเพื่อนใหม่หากต้องการเป็นเพื่อนกันอีกครั้ง"
      title="คุณต้องการลบเพื่อน ?"
      @confirm="removeFriend"
    />
    <UserEditDetailDialog
      :value="items"
      v-model:visible="visible"
      @updated="fetch"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import DataLoadingState from '~/components/skeleton/DataLoadingState.vue'
import ImageProfileDetail from '~/components/skeleton/profile/ImageProfileDetail.vue'
import MyProfilePageSkeleton from '~/components/skeleton/profile/MyProfilePageSkeleton.vue'
import UserEditDetailDialog from '~/components/user/UserEditDetailDialog.vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import { genderEnum } from '~/models/enums/User.enum'
import type { IFindOneUserDetailData } from '~/models/response/UserRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'
import UserProvider, { type IUserProvider } from '~/resource/provider/User.provider'
import { useAuthStore } from '~/stores/Auth'
import { useFriendStore } from '~/stores/Friend'

definePageMeta({ layout: "navbar" });

const visible = ref(false);
const userService: IUserProvider = new UserProvider();
const friendService: IFriendProvider = new FriendProvider();
const authStore = useAuthStore();
const friendStore = useFriendStore();
const { $handleLoading } = useNuxtApp();
const dayjs = useDayjs();
const items = ref<IFindOneUserDetailData>();
const isReportDialogVisible = ref(false)
const isLoading = ref<boolean>(true);
const toast = useToast();
const isSubmitting = ref(false);
const id = computed((): number => Number(useRoute().params.id));
const router = useRouter();
const dialogOpenConfirmRemoveFriends = ref(false);
const targetUserId = computed((): number => {
  return items.value?.id ?? id.value;
});

const isOwnProfile = computed((): boolean => {
  const currentUserId = authStore.user.id;
  return currentUserId > 0 && targetUserId.value === currentUserId;
});

const changeIconGender = computed((): string => {
  if (items.value?.gender === genderEnum.MALE) {
    return "pi pi-mars";
  }

  if (items.value?.gender === genderEnum.FEMALE) {
    return "pi pi-venus";
  }

  return "pi pi-genderless";
});

const isFriend = computed((): boolean => {
  if (isOwnProfile.value) return false;

  if (friendStore.isRemoved(targetUserId.value)) return false;

  if (
    friendStore.getResolvedStatus(targetUserId.value) ===
    FriendRequestStatusEnum.ACCEPTED
  ) {
    return true;
  }

  return (
    items.value?.isFriend === true ||
    items.value?.requestStatus === FriendRequestStatusEnum.ACCEPTED
  );
});

const hasIncomingPendingRequest = computed((): boolean => {
  if (isOwnProfile.value) return false;

  if (isFriend.value) return false;

  if (friendStore.isRequestCancelled(targetUserId.value)) return false;

  if (
    friendStore.getResolvedStatus(targetUserId.value) ===
    FriendRequestStatusEnum.REJECTED
  ) {
    return false;
  }

  if (friendStore.isIncomingPending(targetUserId.value)) {
    return true;
  }

  if (friendStore.isOutgoingPending(targetUserId.value)) {
    return false;
  }

  return (
    items.value?.requestStatus === FriendRequestStatusEnum.PENDING &&
    items.value?.isRequester === true
  );
});

const isFriendRequestSent = computed((): boolean => {
  if (isOwnProfile.value) return false;

  if (isFriend.value) return false;

  if (friendStore.isRequestCancelled(targetUserId.value)) return false;

  if (
    friendStore.getResolvedStatus(targetUserId.value) ===
    FriendRequestStatusEnum.REJECTED
  ) {
    return false;
  }

  if (friendStore.isOutgoingPending(targetUserId.value)) {
    return true;
  }

  if (friendStore.isIncomingPending(targetUserId.value)) {
    return false;
  }

  return (
    items.value?.requestStatus === FriendRequestStatusEnum.PENDING &&
    items.value?.isRequester === false
  );
});

const shouldShowFriendRequestActions = computed((): boolean => {
  return hasIncomingPendingRequest.value && !isFriend.value;
});

const shouldShowAddFriendButton = computed((): boolean => {
  return (
    !isOwnProfile.value &&
    !shouldShowFriendRequestActions.value &&
    !isFriend.value
  );
});

async function useFetchDetails(): Promise<void> {
  if (!Number.isFinite(id.value) || id.value <= 0) return;

  const response = await userService.findOneUserById(id.value);
  const data = response?.data;
  if (!data) return;

  items.value = data;
}

function fetch(): void {
  $handleLoading(useFetchDetails, { loadingUnit: isLoading });
}

onMounted(() => {
  fetch();
});

watch(
  (): number => id.value,
  (): void => {
    fetch();
  },
);

function onClickToOpenChat(): void {
  router.push({ name: "public-chat-id", params: { id: id.value } });
}

async function onClickAcceptRequest(): Promise<void> {
  if (
    !targetUserId.value ||
    isSubmitting.value ||
    !hasIncomingPendingRequest.value
  )
    return;

  isSubmitting.value = true;
  try {
    const response = await friendService.acceptFriendRequest(
      targetUserId.value,
    );

    if (response.data?.status === FriendRequestStatusEnum.ACCEPTED) {
      friendStore.markRequestAccepted(targetUserId.value);
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function onClickRejectRequest(): Promise<void> {
  if (
    !targetUserId.value ||
    isSubmitting.value ||
    !hasIncomingPendingRequest.value
  )
    return;

  isSubmitting.value = true;
  try {
    const response = await friendService.rejectFriendRequest(
      targetUserId.value,
    );

    if (response.data?.status === FriendRequestStatusEnum.REJECTED) {
      friendStore.markRequestRejected(targetUserId.value);
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function onClickAddFriend(friendId: number): Promise<void> {
  if (
    !friendId ||
    isSubmitting.value ||
    isFriend.value ||
    isFriendRequestSent.value ||
    isOwnProfile.value
  )
    return;

  isSubmitting.value = true;
  try {
    const response = await friendService.sendAFriendRequest({ friendId });
    const status = response.data?.status;

    if (status === FriendRequestStatusEnum.PENDING) {
      friendStore.markOutgoingPending(friendId);
    }

    if (status === FriendRequestStatusEnum.ACCEPTED) {
      friendStore.markRequestAccepted(friendId);
    }
  } finally {
    isSubmitting.value = false;
  }
}

function clickAddFriend(): void {
  $handleLoading((): Promise<void> => onClickAddFriend(targetUserId.value));
}

async function onClickRemoveFriend(): Promise<void> {
  if (!targetUserId.value || isSubmitting.value || !isFriend.value) return;

  isSubmitting.value = true;
  try {
    const response = await friendService.removeFriend(targetUserId.value);
    const removedFriendId = response?.data?.friendId;

    if (Number.isFinite(removedFriendId) && removedFriendId === targetUserId.value) {
      friendStore.markFriendRemoved(targetUserId.value);
      dialogOpenConfirmRemoveFriends.value = false;
    }
  } finally {
    isSubmitting.value = false;
  }
}

function clickRemoveFriend(): void {
  if (!targetUserId.value || isSubmitting.value || !isFriend.value) return;

  dialogOpenConfirmRemoveFriends.value = true;
}

function removeFriend(): void {
  $handleLoading(onClickRemoveFriend, {
    toast: {
      instance: toast,
      error: {
        summary: "ไม่สามารถลบเพื่อนได้",
        detail: "เกิดข้อผิดพลาดในการลบเพื่อน",
      },
    },
  });
}
</script>

<style scoped></style>
