<template>
  <div class="flex items-end gap-2 overflow-x-auto whitespace-nowrap py-1">
    <div class="min-w-[120px] shrink-0">
      <InputLabelField label="เพศ">
        <Select
          v-model="localGender"
          :options="genderOptions"
          class="w-full rounded-xl"
          option-label="label"
          option-value="value"
          placeholder="ทั้งหมด" />
      </InputLabelField>
    </div>

    <div class="w-[80px] shrink-0">
      <InputLabelField label="ต่ำสุด">
        <InputNumber
          v-model="localMinAge"
          :max="localMaxAge || 100"
          :min="16" />
      </InputLabelField>
    </div>

    <div class="pb-2 shrink-0">
      -
    </div>
    <div class="w-[80px] shrink-0">
      <InputLabelField label="สูงสุด">
        <InputNumber
          v-model="localMaxAge"
          :max="100"
          :min="localMinAge || 16" />
      </InputLabelField>
    </div>


    <div class="shrink-0 pb-1">
      <Button
        class="text-blue-500 hover:text-blue-700 text-sm "
        size="small"
        @click="clearFilters">
        ล้างค่า
      </Button>
    </div>
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

watch([localGender, localMinAge, localMaxAge], (): void => {
  emit('change')
})

function clearFilters (): void {
  localGender.value = null
  localMinAge.value = undefined
  localMaxAge.value = undefined
}
</script>
