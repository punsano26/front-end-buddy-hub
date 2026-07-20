<template>
  <Dialog
    v-model:visible="model"
    header="ส่งเหรียญ"
    modal>
    <div>
      <h1 class="text-2xl font-bold">
        {{ props.nickname || props.username }}
      </h1>
      <Message severity="warn">
        ยอดเหรียญคงเหลือ: {{ props.coinBalance }}
      </Message>
      <div class="flex flex-col gap-4 mt-4">
        <InputNumber
          v-model="formSendCoins.amount"
          :max="props.coinBalance"
          :min="1"
          class="w-full"
          placeholder="จำนวนเหรียญ" />
        <InputTextarea
          v-model="formSendCoins.description"
          class="w-full"
          placeholder="คำอธิบาย (ไม่บังคับ)"
          rows="3" />
      </div>
      <div class="flex justify-start mt-8 space-x-4">
        <ConfirmButton
          :label="confirmButton"
          class="bg-primary! text-white"
          @click="onConfirm" />

        <CancelButton
          label="ยกเลิก"
          @click="onCancel" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ISendCoinsToAnotherUserPayload } from '~/models/request/WalletReq.model'

interface IProps {
  nickname?: string | null
  username?: string | null
  coinBalance?: number
}

const props = withDefaults(defineProps<IProps>(), {
  nickname: '',
  username: '',
  coinBalance: 0
})

const model = defineModel<boolean>('visible')
const formSendCoins = defineModel<ISendCoinsToAnotherUserPayload>('formSendCoins', { required: true })

const confirmButton = ref('ยืนยัน')

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function onConfirm (): void {
  emit('confirm')
}

function onCancel (): void {
  model.value = false
  emit('cancel')
}
</script>

<style scoped>
/* Glassmorphism & premium UI styles for the modal dialog */
:deep(.p-dialog) {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.dark .p-dialog) {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
}

/* Premium input focus styling */
:deep(.p-inputnumber-input),
:deep(.p-inputtextarea) {
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s ease-in-out;
}

:deep(.dark .p-inputnumber-input),
:deep(.dark .p-inputtextarea) {
  border-color: #334155;
  background: #1e293b;
}

:deep(.p-inputnumber-input:focus),
:deep(.p-inputtextarea:focus) {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  transform: translateY(-1px);
}

/* Custom micro-interactions for buttons */
:deep(.p-button) {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

:deep(.p-button:active) {
  transform: translateY(0);
}
</style>
