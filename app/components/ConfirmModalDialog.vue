<template>
  <Dialog
    v-model:visible="model"
    :closable="false"
    pt:header="p-3!"
    modal>
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold">
        {{ title }}
      </h1>
      <p class="mt-4 text-center text-gray-400 whitespace-pre-line">
        {{ message }}
      </p>

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

<script setup lang="ts">
import Dialog from '~/volt/Dialog.vue'

interface IMessageDialog {
  title?: string
  message?: string
  confirmButton?: string
}

defineProps<IMessageDialog>()

const emit = defineEmits<{
  (e: 'confirm' | 'cancel'): void
}>()

const model = defineModel<boolean>('visible')

const onConfirm = (): void => {
  emit('confirm')
  model.value = false
}

const onCancel = (): void => {
  emit('cancel')
  model.value = false
}
</script>
