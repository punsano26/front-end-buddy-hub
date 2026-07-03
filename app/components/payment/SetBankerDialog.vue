<template>
  <Dialog
    v-model:visible="visible"
    class="sm:w-100 w-9/10"
    header="ผูกบัญชีธนาคาร"
    modal>
    <div class="flex flex-col gap-4">
      <InputLabelField
        label="ธาคาร">
        <Select
          :options="bankOptionsMock"
          class="rounded-xl w-full"
          option-label="label"
          option-value="value"
          placeholder="เลือกธนาคาร" />
      </InputLabelField>
      <InputLabelField
        label="เลขบัญชีธนาคาร">
        <InputNumber
          class="w-full rounded-xl"
          placeholder="กรอกเลขบัญชีธนาคารของคุณ" />
      </InputLabelField>
      <InputLabelField
        label="ชื่อบัญชีธนาคาร"
        placeholder="กรอกชื่อบัญชีธนาคารของคุณ" />
      <div class="flex gap-2 justify-end">
        <CancelButton
          text="ยกเลิก"
          @click="visible = false" />
        <ConfirmButton text="ยืนยัน" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { IBaseOptions } from '~/models/Global.model'

const visible = defineModel<boolean>('visible', { default: false })
const bankOptionsMock = ref<IBaseOptions[]>([
  {
    label: 'ธนาคารกรุงเทพ',
    value: 'bank1'
  },
  {
    label: 'ธนาคารแห่งประเทศไทย',
    value: 'bank2'
  },
  {
    label: 'ธนาคารกสิกรไทย',
    value: 'bank3'
  },
  {
    label: 'ธนาคารไทยพาณิชย์',
    value: 'bank4'
  },
  {
    label: 'ธนาคารกรุงไทย',
    value: 'bank5'
  }
])
</script>

<style>

</style>
