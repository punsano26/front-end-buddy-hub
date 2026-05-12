<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden">
    <HeaderChatRoom class="shrink-0" />
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref="chatScrollContainer"
        class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2 sm:px-3 lg:px-6 xl:px-8 2xl:px-10 py-3 sm:py-4"
      >
        <div class="flex w-full flex-col gap-2">
          <div
            v-for="chat in orderedChatData"
            :key="chat.id"
            class="group flex w-full"
            :class="isOwnMessage(chat) ? 'justify-end' : 'justify-start'"
          >
            <div class="flex min-w-0 max-w-[90%] flex-col sm:max-w-[75%] lg:max-w-[60%] xl:max-w-[55%]">
              <div
                class="flex items-end gap-1.5 min-w-0"
              >
                <DotMenu
                  v-if="isOwnMessage(chat) && !isMessagePending(chat)"
                  :items="getMessageMenuItems(chat)"
                  :message-id="chat.id"
                  :class="[
                    isMessageMenuVisible(chat.id)
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none',
                    'transition-opacity duration-150 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-auto'
                  ]"
                />

                <div
                  class="flex flex-col gap-1 p-3 rounded-2xl shadow-sm max-w-full min-w-0"
                  @click="onMessageTap(chat)"
                  :class="
                    isOwnMessage(chat)
                      ? 'bg-gradient-primary text-black rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                  "
                >
                  <template v-if="isMediaMessage(chat)">
                    <img
                      v-if="getMediaUrl(chat)"
                      :src="getMediaUrl(chat)"
                      alt="Image message"
                      class="max-w-[220px] rounded-lg border border-white/40 object-cover"
                      loading="lazy">
                    <p v-else class="text-xs text-gray-700">
                      Image unavailable
                    </p>
                  </template>
                  <p
                    v-else
                    class="text-sm break-words whitespace-pre-wrap">
                    {{ chat.messageText }}
                  </p>

                  <div class="flex items-center gap-1">
                    <p class="text-xs text-gray-900">
                      {{ dayjs(chat.createdAt).format("hh:mm A") }}
                    </p>
                    <i
                      v-if="isOwnMessage(chat) && isMessagePending(chat)"
                      class="pi pi-spin pi-spinner text-gray-900 text-[10px]"
                    />
                    <i
                      v-else-if="isOwnMessage(chat)"
                      :class="
                        chat.isRead
                          ? 'text-green-700 pi pi-check-circle text-[10px]'
                          : 'text-gray-900 pi pi-circle-off text-[10px]'
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="sendError" class="text-center text-xs text-red-500">
            <span>{{ sendError }}</span>
          </div>
        </div>
      </div>

      <DirectMessageChatRoom
        v-model="form.messageText"
        :is-editing="isEditingMessage"
        :partner-id="id"
        class="shrink-0"
        @cancelEdit="cancelEditMessage"
        @createMessage="sendMessage"
        @createMediaMessage="sendMediaMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AttachmentTypeEnum } from '~/models/enums/Attachment.enum'
import { chatEnum } from '~/models/enums/Chat.enum'
import type { IItems } from '~/models/Global.model'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import type { TErrorResponse } from '~/models/response/Response.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { type IChatMessageItem, useChatRoomStore } from '~/stores/ChatRoom'

const authStore = useAuthStore();
const chatStore = useChatStore();
const chatRoomStore = useChatRoomStore();
const chatService: IChatProvider = new ChatProvider();
const dayjs = useDayjs();
const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/';
const { $handleLoading } = useNuxtApp();
const { pagination, extractPagination } = usePagination();
const { messages: chatData } = storeToRefs(chatRoomStore);
const sendError = computed((): string => chatRoomStore.getSendError(id.value));
const id = computed(() => Number(useRoute().params.id));
definePageMeta({ layout: "chat" });

const form = ref<ICreateMessagePayload>({
  receiverId: id.value,
  messageType: chatEnum.TEXT,
  messageText: "",
});

const editingMessageId = ref<number | null>(null);
const isEditingMessage = computed(
  (): boolean => editingMessageId.value !== null,
);
const isMarkingRead = ref(false);
const chatScrollContainer = ref<HTMLElement | null>(null);
const isCompactScreen = ref(false);
const activeMenuMessageId = ref<number | null>(null);
let screenQuery: MediaQueryList | null = null;
const orderedChatData = computed((): IChatMessageItem[] => {
  return [...chatData.value].sort(
    (a: IChatMessageItem, b: IChatMessageItem): number => {
      const aTime = Number(new Date(a.createdAt));
      const bTime = Number(new Date(b.createdAt));
      return aTime - bTime;
    },
  );
});

async function scrollToBottom(): Promise<void> {
  await nextTick();
  if (!chatScrollContainer.value) return;
  chatScrollContainer.value.scrollTop = chatScrollContainer.value.scrollHeight;
}

function getMessageMenuItems(message: ICreateMessageData): IItems[] {
  return [
    { label: "แก้ไข", command: (): void => startEditMessage(message) },
    {
      label: "ลบ",
      command: (): Promise<void> => confirmDeleteMessage(message),
    },
  ];
}

function startEditMessage(message: ICreateMessageData): void {
  if (!isOwnMessage(message)) return;

  editingMessageId.value = message.id;
  form.value.messageText = message.messageText;
}

function cancelEditMessage(): void {
  editingMessageId.value = null;
  form.value.messageText = "";
}
async function confirmDeleteMessage(
  message: ICreateMessageData,
): Promise<void> {
  try {
    await chatService.deleteMessage(message.id);

    chatData.value = chatData.value.filter(
      (item: ICreateMessageData): boolean => item.id !== message.id,
    );

    if (editingMessageId.value === message.id) {
      cancelEditMessage();
    }
  } catch (error: TErrorResponse) {
    const errorMessage = error?.message;
    chatRoomStore.setSendError(id.value, errorMessage || '');
  }
}

async function markMessagesAsRead(): Promise<void> {
  if (isMarkingRead.value) return;

  const currentUserId = authStore.user.id;
  const targetUserId = id.value;

  if (currentUserId <= 0 || targetUserId <= 0) return;

  const unreadMessageIds = chatData.value
    .filter(
      (message: ICreateMessageData): boolean =>
        message.senderId === targetUserId &&
        message.receiverId === currentUserId &&
        !message.isRead,
    )
    .map((message: ICreateMessageData): number => message.id);

  if (unreadMessageIds.length === 0) return;

  isMarkingRead.value = true;

  try {
    await chatService.markMessagesAsRead({ friendId: targetUserId });

    chatData.value = chatData.value.map(
      (message: ICreateMessageData): ICreateMessageData => {
        if (
          message.senderId === targetUserId &&
          message.receiverId === currentUserId
        ) {
          return { ...message, isRead: true };
        }

        return message;
      },
    );

    chatStore.removeUnreadMessageIds(unreadMessageIds, currentUserId);
    chatStore.setConversationUnreadCount(targetUserId, 0, currentUserId);
  } finally {
    isMarkingRead.value = false;
  }
}

function isOwnMessage(message: ICreateMessageData): boolean {
  return message.senderId === authStore.user.id;
}

function isMessagePending(message: IChatMessageItem): boolean {
  return !!message.isSending || !!message.isEditing;
}

function onMessageTap(message: ICreateMessageData): void {
  if (!isCompactScreen.value || !isOwnMessage(message)) return;

  activeMenuMessageId.value =
    activeMenuMessageId.value === message.id ? null : message.id;
}

function isMessageMenuVisible(messageId: number): boolean {
  return isCompactScreen.value && activeMenuMessageId.value === messageId;
}

function isMediaMessage(message: ICreateMessageData): boolean {
  return message.messageType === chatEnum.MEDIA;
}

function resolveMediaUrl(value: string): string {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }
  return imageBaseUrl + value;
}

function getMediaUrl(message: ICreateMessageData): string {
  const attachment = message.attachments?.find(
    (item): boolean => item.attachmentType === AttachmentTypeEnum.IMAGE,
  ) || message.attachments?.[0];

  if (attachment?.url) {
    return resolveMediaUrl(attachment.url);
  }

  if (message.messageText) {
    return resolveMediaUrl(message.messageText);
  }

  return '';
}

function isCurrentConversationMessage(message: ICreateMessageData): boolean {
  const currentUserId = authStore.user.id;
  const targetUserId = id.value;

  if (currentUserId <= 0) {
    return (
      message.senderId === targetUserId || message.receiverId === targetUserId
    );
  }

  return (
    (message.senderId === currentUserId &&
      message.receiverId === targetUserId) ||
    (message.senderId === targetUserId && message.receiverId === currentUserId)
  );
}

function upsertMessage(message: ICreateMessageData): void {
  if (!isCurrentConversationMessage(message)) return;

  chatRoomStore.upsertMessage(message);
}

const { removeSocketListener, startSocketSync, stopSocketSync } =
  useChatSocketListener({
    onReceiveMessage: (message: ICreateMessageData): void => {
      if (!isCurrentConversationMessage(message)) return;

      upsertMessage(message);

      if (
        message.senderId === id.value &&
        message.receiverId === authStore.user.id
      ) {
        void markMessagesAsRead();
      }

      void scrollToBottom();
    },
    onMessagesRead: (messageIds: number[]): void => {
      chatData.value = chatData.value.map(
        (message: ICreateMessageData): ICreateMessageData => {
          if (messageIds.includes(message.id)) {
            return { ...message, isRead: true };
          }
          return message;
        },
      );
    },
    onMessageDeleted: (messageId: number): void => {
      chatData.value = chatData.value.filter(
        (message: ICreateMessageData): boolean => message.id !== messageId,
      );

      if (editingMessageId.value === messageId) {
        cancelEditMessage();
      }
    },
    onMessageEdited: (updatedMessage: ICreateMessageData): void => {
      if (!isCurrentConversationMessage(updatedMessage)) return;

      chatData.value = chatData.value.map(
        (message: ICreateMessageData): ICreateMessageData => {
          if (message.id === updatedMessage.id) {
            return { ...message, messageText: updatedMessage.messageText };
          }
          return message;
        },
      );
    },
  });

async function useFetch(): Promise<void> {
  const response = await chatService.findOneMessagePaginate({
    partnerId: id.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
  });

  const messages = Array.isArray(response?.data) ? response.data : [];
  chatRoomStore.setMessages(messages);
  pagination.value = extractPagination(response?.pagination);
  await markMessagesAsRead();
  await scrollToBottom();
}
function fetch(): void {
  $handleLoading(useFetch);
}
async function sendMessage(messageText: string, messageType: chatEnum = form.value.messageType): Promise<void> {
  form.value.messageText = messageText;
  const wasEditing = isEditingMessage.value;

  const isSuccess = await chatRoomStore.submitMessage({
    messageText,
    receiverId: form.value.receiverId,
    messageType,
    currentUserId: authStore.user.id,
    isEditingMessage: isEditingMessage.value,
    editingMessageId: editingMessageId.value,
    onMessagesUpdated: scrollToBottom,
  });

  if (!isSuccess) return;

  if (wasEditing) {
    cancelEditMessage();
    return;
  }

  form.value.messageText = "";
}

async function sendMediaMessage(message: string | ICreateMessageData): Promise<void> {
  if (typeof message !== 'string') {
    upsertMessage(message);
    chatStore.pushConversationActivityFromMessage(message, authStore.user.id);
    await scrollToBottom();
    return;
  }

  await chatRoomStore.submitMessage({
    messageText: message,
    receiverId: form.value.receiverId,
    messageType: chatEnum.MEDIA,
    currentUserId: authStore.user.id,
    onMessagesUpdated: scrollToBottom,
  });
}

onMounted((): void => {
  fetch();
  startSocketSync(200);

  screenQuery = window.matchMedia('(max-width: 639px)');
  isCompactScreen.value = screenQuery.matches;

  const handleScreenChange = (event: MediaQueryListEvent): void => {
    isCompactScreen.value = event.matches;
    if (!event.matches) {
      activeMenuMessageId.value = null;
    }
  };

  screenQuery.addEventListener('change', handleScreenChange);

  onUnmounted((): void => {
    screenQuery?.removeEventListener('change', handleScreenChange);
    screenQuery = null;
  });
});

onUnmounted((): void => {
  stopSocketSync();
  removeSocketListener();
});

watch(
  (): number => id.value,
  (nextId: number, previousId?: number): void => {
    cancelEditMessage();
    activeMenuMessageId.value = null;
    if (typeof previousId === 'number') {
      chatRoomStore.clearSendError(previousId);
    }
    form.value.receiverId = nextId;
    fetch();
  },
);

watch(
  (): number => orderedChatData.value.length,
  (): void => {
    void scrollToBottom();
  },
);
</script>

<style scoped></style>
