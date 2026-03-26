<template>
  <div class="flex gap-2 items-center">
    <InputLabelField label="เพศ">
      <Select
        v-model="localGender"
        :options="genderOptions"
        class="w-full"
        option-label="label"
        option-value="value"
        placeholder="ทั้งหมด" />
    </InputLabelField>
    <InputLabelField
      :min="16"

      label="อายุต่ำสุด"
      type="number">
      <InputNumber
        v-model="localMinAge"
        :max="localMaxAge || 100" />
    </InputLabelField>
    <p>-</p>
    <InputLabelField

      label="อายุสูงสุด"
      type="number">
      <InputNumber
        v-model="localMaxAge"
        :min="localMinAge || 16" />
    </InputLabelField>
    <p
      class="text-blue-500 hover:text-blue-700 cursor-pointer text-sm whitespace-nowrap"
      @click="clearFilters">
      ล้างค่า
    </p>
  </div>
</template>

<script setup lang="ts">
import { genderEnum } from '~/models/enums/User.enum'

const localGender = defineModel<genderEnum | null>('gender', { default: null })
const localMinAge = defineModel<number | undefined>('minAge', { default: undefined })
const localMaxAge = defineModel<number | undefined>('maxAge', { default: undefined })

const genderOptions = [
  { label: 'ผู้ชาย', value: genderEnum.MALE },
  { label: 'ผู้หญิง', value: genderEnum.FEMALE },
  { label: 'อื่นๆ', value: genderEnum.OTHER }
]

const emit = defineEmits<{
  change: []
}>()

// watch ทั้ง 3 ตัว แล้ว emit change ให้ parent fetch ใหม่
watch([localGender, localMinAge, localMaxAge], (): void => {
  emit('change')
})

function clearFilters (): void {
  localGender.value = null
  localMinAge.value = undefined
  localMaxAge.value = undefined
}
</script>
