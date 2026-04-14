<template>
  <Dialog
    v-model:visible="visible"
    class="sm:w-100 w-9/10"
    pt:content:class="p-0"
    pt:header-actions:class="!m-0 !p-0 !flex"
    pt:header:class="!absolute !top-2 !right-2 !z-30 !p-0 !m-0 !bg-transparent !border-0 !shadow-none"
    pt:root:class="!relative bg-surface-900! border-none rounded-xl shadow-lg"
    pt:title:class="hidden"
    dismissable-mask
    modal>
    <img
      :src="value.bannerImg || 'https://picsum.photos/seed/picsum/200/300'"
      alt="user banner"
      class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl">
    <div class="flex justify-center items-center gap-4 -mt-12 px-4">
      <img
        :src="value.profileImg || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
        alt="user avatar"
        class="w-24 h-24 rounded-full border-4 border-surface-0 object-cover">
    </div>
    <div class="flex flex-col items-center gap-2">
      <p class="text-xl text-white font-semibold">
        {{ value.nickname || value.username }}
      </p>
      <p
        class="text-xs text-surface-400 dark:text-surface-500 hover:text-surface-300 dark:hover:text-surface-400 cursor-pointer"
        @click="onClickUserDetail(value.id)">
        @{{ value.username }}
      </p>
      <p
        class="text-center mx-auto max-w-70 text-sm text-surface-500 dark:text-surface-400">
        {{ value.description || '-' }}
      </p>
    </div>
    <div class="flex justify-center items-center gap-2 mt-2 p-4">
      <template v-if="shouldShowFriendRequestActions">
        <Button
          :disabled="isSubmitting"
          class="w-full bg-emerald-500 border-none text-black!"
          @click="onClickAcceptRequest">
          ยอมรับ
        </Button>
        <Button
          :disabled="isSubmitting"
          class="w-full bg-red-800! border-none enabled:hover:bg-gray-900"
          @click="onClickRejectRequest">
          ปฏิเสธ
        </Button>
      </template>
      <Button
        v-else-if="shouldShowAddFriendButton"
        :disabled="isFriendRequestSent || isSubmitting"
        class="w-full bg-linear-to-r from-sky-500 to-pink-600 border-none text-black!"
        @click="clickAddFriend">
        {{
          isFriendRequestSent
            ? 'ส่งคำขอแล้ว'
            : 'เพิ่มเพื่อน'
        }}
      </Button>
      <Button
        class="w-full bg-gray-800! border-none enabled:hover:bg-gray-900"
        @click="onClickToOpenChat(value.id)">
        แชท
      </Button>
      <Button pt:root:class="w-full bg-transparent border-none text-red-500 enabled:hover:bg-red-500/10 enabled:hover:text-red-700 enabled:active:bg-red-500/20 active:text-red-700">
        รายงาน
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FriendRequestStatusEnum } from '~/models/enums/Friend.enum'
import type { IFindAllRequestList } from '~/models/response/FriendRes.model'
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import type { IFriendProvider } from '~/resource/provider/Friend.provider'
import FriendProvider from '~/resource/provider/Friend.provider'
import { useAuthStore } from '~/stores/Auth'
import { useFriendStore } from '~/stores/Friend'
import Dialog from '~/volt/Dialog.vue'

const friendService: IFriendProvider = new FriendProvider()
const visible = defineModel<boolean>('visible', { default: false })
const items = ref<IFindAllRequestList[]>([])
const router = useRouter()
const { $handleLoading } = useNuxtApp()
const isSubmitting = ref(false)
const authStore = useAuthStore()
const friendStore = useFriendStore()
const { pagination, extractPagination } = usePagination()
const props = defineProps<{
  value: IFindOneCurrentUserData
}>()

const isFriendAccepted = computed((): boolean => {
  if (friendStore.getResolvedStatus(props.value.id) === FriendRequestStatusEnum.ACCEPTED) {
    return true
  }

  const currentUserId = authStore.user.id
  if (!currentUserId) return false

  return items.value.some((request: IFindAllRequestList): boolean => {
    const isBetweenUsers = (request.requesterId === props.value.id && request.receiverId === currentUserId)
      || (request.requesterId === currentUserId && request.receiverId === props.value.id)

    return isBetweenUsers && request.status === FriendRequestStatusEnum.ACCEPTED
  })
})

const hasIncomingPendingRequest = computed((): boolean => {
  if (friendStore.isIncomingPending(props.value.id)) {
    return true
  }

  const currentUserId = authStore.user.id
  if (!currentUserId) return false

  return items.value.some((request: IFindAllRequestList): boolean => {
    return request.status === FriendRequestStatusEnum.PENDING
      && request.receiverId === currentUserId
      && request.requesterId === props.value.id
  })
})

const shouldShowFriendRequestActions = computed((): boolean => {
  return hasIncomingPendingRequest.value && !isFriendAccepted.value
})

const shouldShowAddFriendButton = computed((): boolean => {
  return !shouldShowFriendRequestActions.value && !isFriendAccepted.value
})

const isFriendRequestSent = computed((): boolean => {
  if (friendStore.isOutgoingPending(props.value.id)) {
    return true
  }

  const currentUserId = authStore.user.id
  if (!currentUserId) return false

  return items.value.some((request: IFindAllRequestList): boolean => {
    return request.status === FriendRequestStatusEnum.PENDING
      && request.receiverId === props.value.id
      && request.requesterId === currentUserId
  })
})

function updateIncomingRequestStatus (status: FriendRequestStatusEnum, responseAt: string | null = null): void {
  const currentUserId = authStore.user.id
  if (!currentUserId) return

  const request = items.value.find((item: IFindAllRequestList): boolean => {
    return item.requesterId === props.value.id && item.receiverId === currentUserId
  })

  if (request) {
    request.status = status
    request.responseAt = responseAt || request.responseAt
  }
}

function onClickUserDetail (userId: number): void {
  router.push({ name: 'public-profile-id', params: { id: userId } })
}

function onClickToOpenChat (userId: number): void {
  router.push({ name: 'public-chat-id', params: { id: userId } })
}


async function onClickAddFriend (friendId: number): Promise<void> {
  if (isSubmitting.value || isFriendRequestSent.value) return

  isSubmitting.value = true
  try {
    const response = await friendService.sendAFriendRequest({ friendId })
    const status = response.data?.status

    if (status === FriendRequestStatusEnum.PENDING) {
      friendStore.markOutgoingPending(friendId)
    }

    if (status === FriendRequestStatusEnum.ACCEPTED) {
      friendStore.markRequestAccepted(friendId)
    }
  } finally {
    isSubmitting.value = false
  }
}

function clickAddFriend (): void {
  $handleLoading((): Promise<void> => onClickAddFriend(props.value.id))
}

async function onClickAcceptRequest (): Promise<void> {
  if (!hasIncomingPendingRequest.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    const response = await friendService.acceptFriendRequest(props.value.id)

    if (response.data?.status === FriendRequestStatusEnum.ACCEPTED) {
      friendStore.markRequestAccepted(props.value.id)
      updateIncomingRequestStatus(FriendRequestStatusEnum.ACCEPTED, response.data.responseAt)
    }
  } finally {
    isSubmitting.value = false
  }
}

async function onClickRejectRequest (): Promise<void> {
  if (!hasIncomingPendingRequest.value || isSubmitting.value) return

  isSubmitting.value = true
  try {
    const response = await friendService.rejectFriendRequest(props.value.id)

    if (response.data?.status === FriendRequestStatusEnum.REJECTED) {
      friendStore.markRequestRejected(props.value.id)
      updateIncomingRequestStatus(FriendRequestStatusEnum.REJECTED, response.data.responseAt)
    }
  } finally {
    isSubmitting.value = false
  }
}

async function getRequestList (): Promise<void> {
  const response = await friendService.findAllRequestPaginate({
    page: pagination.value.page,
    limit: pagination.value.limit
  })

  items.value = response?.data || []

  if (hasIncomingPendingRequest.value) {
    friendStore.markIncomingPending(props.value.id)
  } else {
    friendStore.clearIncomingPending(props.value.id)
  }

  pagination.value = extractPagination(response)
}


watch(
  (): [boolean, number] => [visible.value, props.value.id], ([isVisible, userId]: [boolean, number],
    [wasVisible, previousId]: [boolean, number]): void => {
    if (!isVisible || !userId) return
    if (!wasVisible || userId !== previousId) {
      $handleLoading(getRequestList)
    }
  }
)
</script>

<style scoped>

</style>
