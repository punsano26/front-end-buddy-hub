<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 relative transition-colors duration-250">
    <!-- Ambient subtle background decorative blurs -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-600/5 animate-pulse" style="animation-duration: 8s" />
      <div class="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl dark:bg-purple-600/5 animate-pulse" style="animation-duration: 12s; animation-delay: 1.5s" />
    </div>

    <HeaderChatRoom class="shrink-0" />
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref="chatScrollContainer"
        class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-6 lg:px-8 xl:px-12 py-4"
      >
        <div class="flex w-full flex-col gap-3">
          <div
            v-for="chat in orderedChatData"
            :key="chat.id"
            class="group flex w-full"
            :class="isOwnMessage(chat) ? 'justify-end' : 'justify-start'"
          >
            <div class="flex min-w-0 max-w-[85%] flex-col sm:max-w-[70%] lg:max-w-[55%]">
              <div
                class="flex items-end gap-2 min-w-0"
                :class="isOwnMessage(chat) ? 'flex-row' : 'flex-row-reverse'"
              >
                <!-- Message Action Menu -->
                <DotMenu
                  v-if="isOwnMessage(chat) && !isMessagePending(chat)"
                  :items="getMessageMenuItems(chat)"
                  :message-id="chat.id"
                  :class="[
                    isMessageMenuVisible(chat.id)
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none',
                    'transition-opacity duration-150 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 sm:pointer-events-auto self-center'
                  ]"
                />

                <!-- Message Bubble -->
                <div
                  class="flex flex-col gap-1 px-4 py-2.5 rounded-2xl shadow-sm max-w-full min-w-0 transition-all duration-200"
                  @click="onMessageTap(chat)"
                  :class="[
                    isOwnMessage(chat)
                      ? 'bg-gradient-primary text-white rounded-br-xs shadow-indigo-500/10 dark:shadow-indigo-950/20'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                  ]"
                >
                  <!-- Media/Image Block -->
                  <template v-if="isMediaMessage(chat)">
                    <img
                      v-if="getMediaUrl(chat)"
                      :src="getMediaUrl(chat)"
                      alt="Image message"
                      class="max-w-full sm:max-w-[260px] rounded-lg border border-white/20 dark:border-slate-800/80 object-cover shadow-sm transition hover:scale-[1.015] duration-200 cursor-pointer"
                      loading="lazy">
                    <p v-else class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Image unavailable
                    </p>
                  </template>

                  <!-- Call Action Block -->
                  <template v-else-if="isCallMessage(chat)">
                    <CallMessageCard
                      :chat="chat"
                      :is-own="isOwnMessage(chat)"
                      @click-call="clickCall"
                    />
                  </template>

                  <!-- Coin Granted Block -->
                  <template v-else-if="isCoinMessage(chat)">
                    <CoinMessageCard
                      :chat="chat"
                      :is-own="isOwnMessage(chat)"
                      @coin-event="handleCoinMessageEvent"
                    />
                  </template>

                  <!-- Text Block -->
                  <p
                    v-else
                    class="text-sm break-words whitespace-pre-wrap leading-relaxed">
                    {{ chat.messageText }}
                  </p>

                  <!-- Time & Read Status -->
                  <div class="flex items-center justify-end gap-1.5 mt-1 select-none">
                    <p
                      class="text-[10px]"
                      :class="isOwnMessage(chat) ? 'text-white/75' : 'text-slate-400 dark:text-slate-500'"
                    >
                      {{ dayjs(chat.createdAt).format("hh:mm A") }}
                    </p>
                    
                    <template v-if="isOwnMessage(chat)">
                      <i
                        v-if="isMessagePending(chat)"
                        class="pi pi-spin pi-spinner text-white/70 text-[9px]"
                      />
                      <i
                        v-else
                        :class="
                          chat.isRead
                            ? 'text-emerald-300 dark:text-emerald-400 pi pi-check-circle'
                            : 'text-white/60 pi pi-circle-off'
                        "
                        class="text-[9px]"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="sendError" class="text-center text-xs text-red-500 font-medium">
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
import { CoinGrantedEvent } from '~/models/enums/Coin.enum'
import type { IItems } from '~/models/Global.model'
import type { ICreateMessagePayload } from '~/models/request/ChatReq.model'
import type { ICreateMessageData } from '~/models/response/ChatRes.model'
import type { TErrorResponse } from '~/models/response/Response.model'
import ChatProvider, { type IChatProvider } from '~/resource/provider/Chat.provider'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/Auth'
import { useChatStore } from '~/stores/Chat'
import { useCallStore } from '~/stores/Call'
import { type IChatMessageItem, useChatRoomStore } from '~/stores/ChatRoom'

const authStore = useAuthStore();
const chatStore = useChatStore();
const callStore = useCallStore();
const toast = useToast();
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
  const items: IItems[] = [];
  if (message.messageType === chatEnum.TEXT) {
    items.push({ label: "แก้ไข", command: (): void => startEditMessage(message) });
  }
  items.push({
    label: "ลบ",
    command: (): Promise<void> => confirmDeleteMessage(message),
  });
  return items;
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

function isCallMessage(message: ICreateMessageData): boolean {
  return [
    chatEnum.START_CALL,
    chatEnum.END_CALL,
    chatEnum.MISSED_CALL,
  ].includes(message.messageType);
}

function isCoinMessage(message: ICreateMessageData): boolean {
  return message.messageType === chatEnum.COIN_GRANTED;
}

function handleCoinMessageEvent(event: CoinGrantedEvent, message: ICreateMessageData): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event, { detail: message }));
  }
}

async function onClickCall(): Promise<void> {
  const isDesktop =
    typeof window !== "undefined" &&
    !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  let newWindow: Window | null = null;
  if (isDesktop) {
    const width = 450;
    const height = 650;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    newWindow = window.open(
      "about:blank",
      "_blank",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`,
    );
  }

  try {
    await callStore.initiateCall(id.value);
    if (callStore.callData) {
      const resolved = useRouter().resolve({
        name: "call",
        query: { callData: encodeURIComponent(JSON.stringify(callStore.callData)) },
      });
      if (newWindow) {
        newWindow.location.href = resolved.href;
      } else {
        void useRouter().push(resolved);
      }
    } else if (newWindow) {
      newWindow.close();
    }
  } catch (error: any) {
    if (newWindow) {
      newWindow.close();
    }
    throw error;
  }
}

function clickCall(): void {
  $handleLoading(onClickCall);
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

      if (isCoinMessage(message)) {
        const targetEvent = message.senderId === authStore.user.id
          ? CoinGrantedEvent.SPEND_COIN
          : CoinGrantedEvent.GRANT_COIN;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(targetEvent, { detail: message }));
        }
      }

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
    receiverId: id.value,
    messageType,
    currentUserId: authStore.user.id,
    isEditingMessage: isEditingMessage.value,
    editingMessageId: editingMessageId.value,
    onMessagesUpdated: scrollToBottom,
  });

  if (!isSuccess) {
    const errorMsg = chatRoomStore.getSendError(id.value);
    if (errorMsg.includes('ถูกระงับ')) {
      toast.add({
        severity: 'error',
        summary: 'ผิดพลาด',
        detail: 'บัญชีของคุณถูกระงับ ไม่สามารถส่งข้อความได้',
        life: 3000
      })
    }
    return;
  }

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

  const isSuccess = await chatRoomStore.submitMessage({
    messageText: message,
    receiverId: id.value,
    messageType: chatEnum.MEDIA,
    currentUserId: authStore.user.id,
    onMessagesUpdated: scrollToBottom,
  });

  if (!isSuccess) {
    const errorMsg = chatRoomStore.getSendError(id.value);
    if (errorMsg.includes('ถูกระงับ')) {
      toast.add({
        severity: 'error',
        summary: 'ผิดพลาด',
        detail: 'บัญชีของคุณถูกระงับ ไม่สามารถส่งข้อความได้',
        life: 3000
      })
    }
  }
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
