<template>
  <div class="h-full min-h-0 flex flex-col overflow-hidden">
    <HeaderChatRoom class="shrink-0" />
    <div ref="chatScrollContainer" class="flex-1 min-h-0 overflow-y-auto p-4">
      <div class="flex flex-col gap-2">
        <div
          v-for="chat in orderedChatData"
          :key="chat.id"
          :class="isOwnMessage(chat) ? 'flex justify-end' : 'flex'"
          class="group"
        >
          <div class="flex flex-col max-w-[70%] min-w-0">
            <div class="flex items-center min-w-0">
              <DotMenu
                v-if="isOwnMessage(chat) && !isMessagePending(chat)"
                :items="getMessageMenuItems(chat)"
                :message-id="chat.id"
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
              />

              <div
                class="flex flex-col gap-1 p-3 rounded-2xl shadow-sm max-w-full min-w-0"
                :class="
                  isOwnMessage(chat)
                    ? 'bg-gradient-primary text-black rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                "
              >
                <p class="text-sm break-all whitespace-pre-wrap">
                  {{ chat.messageText }}
                </p>

                <div class="flex items-center gap-1">
                  <p class="text-xs text-gray-500">
                    {{ dayjs(chat.createdAt).format("hh:mm A") }}
                  </p>
                  <i
                    v-if="isOwnMessage(chat) && isMessagePending(chat)"
                    class="pi pi-spin pi-spinner text-gray-600 text-[10px]"
                  />
                  <i
                    v-else-if="isOwnMessage(chat)"
                    :class="
                      chat.isRead
                        ? 'text-green-600 pi pi-check-circle text-[10px]'
                        : 'text-gray-600 pi pi-circle-off text-[10px]'
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center text-xs text-red-500">
          <span>{{ sendError }}</span>
        </div>
      </div>
    </div>

    <DirectMessageChatRoom
      v-model="form.messageText"
      :is-editing="isEditingMessage"
      class="shrink-0"
      @cancelEdit="cancelEditMessage"
      @createMessage="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
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
const { $handleLoading } = useNuxtApp();
const { pagination, extractPagination } = usePagination();
const { messages: chatData, sendError } = storeToRefs(chatRoomStore);
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
    chatRoomStore.setSendError(errorMessage || '');
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
    onMessageEdited: (
      updatedMessage: Pick<ICreateMessageData, "id" | "messageText">,
    ): void => {
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
    friendId: id.value,
    page: pagination.value.page,
    limit: pagination.value.limit,
  });
  chatRoomStore.setMessages(response.data || []);
  pagination.value = extractPagination(response);
  await markMessagesAsRead();
  await scrollToBottom();
}
function fetch(): void {
  $handleLoading(useFetch);
}
async function sendMessage(messageText: string): Promise<void> {
  form.value.messageText = messageText;
  const wasEditing = isEditingMessage.value;

  const isSuccess = await chatRoomStore.submitMessage({
    messageText,
    receiverId: form.value.receiverId,
    messageType: form.value.messageType,
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

onMounted((): void => {
  fetch();
  startSocketSync(200);
});

onUnmounted((): void => {
  stopSocketSync();
  removeSocketListener();
});

watch(
  (): number => id.value,
  (nextId: number): void => {
    cancelEditMessage();
    form.value.receiverId = nextId;
    fetch();
  },
);
</script>

<style scoped></style>
