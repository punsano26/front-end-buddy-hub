<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[460px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header -->
    <div class="relative w-full flex flex-col items-center gap-3 px-6 pt-8 pb-3 text-center select-none">
      <!-- Close Button -->
      <button
        class="absolute right-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-bold border border-primary-500/20">
        <i class="pi pi-building-columns text-xs" />
        <span>ข้อมูลบัญชีธนาคาร</span>
      </div>

      <h6 class="font-extrabold text-2xl text-surface-900 dark:text-white tracking-wide">
        ผูกบัญชีธนาคาร
      </h6>

      <p class="text-xs text-surface-500 dark:text-surface-400 max-w-[340px]">
        โปรดเลือกธนาคารและกรอกข้อมูลบัญชีเพื่อใช้รับเงินจากการให้บริการ
      </p>
    </div>

    <!-- Form Content -->
    <div class="px-6 flex flex-col gap-4 mt-2">
      <div class="flex flex-col gap-3.5">
        <!-- Bank Dropdown Selection -->
        <InputLabelField
          label="ธนาคาร">
          <Select
            v-model="selectedBank"
            :options="bankOptionsMock"
            class="rounded-xl w-full"
            option-label="label"
            option-value="value"
            placeholder="เลือกธนาคารผู้ให้บริการ" />
        </InputLabelField>

        <!-- Bank Account Number -->
        <InputLabelField
          v-model="accountNumber"
          label="เลขบัญชีธนาคาร"
          maxlength="15"
          placeholder="กรอกเลขบัญชีธนาคารของคุณ"
          type="text"
          @input="onAccountNumberInput" />

        <!-- Bank Account Name -->
        <InputLabelField
          v-model="accountName"
          label="ชื่อบัญชีธนาคาร"
          placeholder="กรอกชื่อบัญชีธนาคารของคุณ"
          type="text" />
      </div>
    </div>

    <!-- Actions (Inside body for consistent layout) -->
    <div class="flex justify-end gap-2.5 px-6 mt-6 mb-8 w-full">
      <CancelButton
        class="flex-1 py-3!"
        text="ยกเลิก"
        @click="visible = false" />
      <ConfirmButton
        :disabled="!isValid"
        class="flex-1 py-3!"
        text="บันทึกข้อมูล"
        @click="handleSave" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { IBaseOptions } from '~/models/Global.model'

const visible = defineModel<boolean>('visible', { default: false })
const bankInfo = defineModel<{ bankName: string, accountNumber: string, accountName: string } | null>('bankInfo', { default: null })
const toast = useToast()

const selectedBank = ref<string | null>(null)
const accountNumber = ref<string>('')
const accountName = ref<string>('')

const bankOptionsMock = ref<IBaseOptions[]>([
  {
    label: 'ธนาคารกสิกรไทย (KBANK)',
    value: 'KBANK'
  },
  {
    label: 'ธนาคารไทยพาณิชย์ (SCB)',
    value: 'SCB'
  },
  {
    label: 'ธนาคารกรุงเทพ (BBL)',
    value: 'BBL'
  },
  {
    label: 'ธนาคารกรุงไทย (KTB)',
    value: 'KTB'
  },
  {
    label: 'ธนาคารกรุงศรีอยุธยา (BAY)',
    value: 'BAY'
  },
  {
    label: 'ธนาคารออมสิน (GSB)',
    value: 'GSB'
  }
])

watch(visible, (newVal: boolean): void => {
  if (newVal) {
    if (bankInfo.value) {
      const matched = bankOptionsMock.value.find(
        (b: IBaseOptions): boolean => b.label === bankInfo.value?.bankName || b.value === bankInfo.value?.bankName
      )
      const matchedValue = matched?.value
      selectedBank.value = typeof matchedValue === 'string' ? matchedValue : null
      accountNumber.value = bankInfo.value.accountNumber
      accountName.value = bankInfo.value.accountName
    } else {
      selectedBank.value = null
      accountNumber.value = ''
      accountName.value = ''
    }
  }
})

const isValid = computed((): boolean => {
  return !!selectedBank.value && accountNumber.value.length >= 10 && accountName.value.trim().length > 0
})

const onAccountNumberInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  accountNumber.value = target.value.replace(/\D/g, '')
}

const handleSave = (): void => {
  const matched = bankOptionsMock.value.find((b: IBaseOptions): boolean => b.value === selectedBank.value)
  bankInfo.value = {
    bankName: matched ? matched.label.split(' (')[0] ?? matched.label : selectedBank.value ?? '',
    accountNumber: accountNumber.value,
    accountName: accountName.value
  }
  toast.add({
    severity: 'success',
    summary: 'ผูกบัญชีธนาคารสำเร็จ',
    detail: 'ข้อมูลบัญชีธนาคารของคุณได้รับการบันทึกเรียบร้อยแล้ว',
    life: 3000
  })
  visible.value = false
}
</script>

<style>

</style>
