<template>
  <Dialog
    v-model:visible="visible"
    class="sm:w-110 w-[95%]"
    header="ผูกบัญชีธนาคาร"
    modal>
    <div class="flex flex-col gap-4 pt-2">
      <p class="text-xs text-surface-500 dark:text-surface-400">
        โปรดเลือกธนาคารและกรอกข้อมูลบัญชีเพื่อใช้สำหรับการรับเงินจากการให้บริการ
      </p>

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

    <!-- Footer Actions -->
    <template #footer>
      <div class="flex justify-end gap-2.5 w-full mt-2">
        <CancelButton
          text="ยกเลิก"
          @click="visible = false" />
        <ConfirmButton
          :disabled="!isValid"
          text="บันทึกข้อมูล"
          @click="handleSave" />
      </div>
    </template>
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
      selectedBank.value = matched ? matched.value : null
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
