<template>
  <div class="flex flex-col md:flex-row md:items-center gap-2 overflow-x-auto">
    <div class="shrink-0">
      <Button
        pt:root:class="h-10 w-10 bg-gray-800/20 enabled:hover:bg-gray-800/20 rounded-xl border-none text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
        size="small"
        @click="toggleFilter">
        <i :class="['pi', isFilterOpen ? 'pi-filter-slash' : 'pi-filter']" />
      </Button>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 -translate-x-2">
      <div
        v-if="isFilterOpen"
        class="flex items-end gap-2">
        <div class="shrink-0">
          <InputLabelField
            label="เพศ">
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

        <div class="pb-2 shrink-0 text-gray-400">
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
            :disabled="!hasActiveFilters"
            class="text-blue-500 hover:text-blue-700 disabled:opacity-40 text-sm"
            size="small"
            @click="clearFilters">
            ล้างค่า
          </Button>
        </div>
      </div>
    </Transition>
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

const isFilterOpen = ref(false)

const hasActiveFilters = computed((): boolean => {
  return localGender.value !== null
    || localMinAge.value !== undefined
    || localMaxAge.value !== undefined
})

function toggleFilter (): void {
  isFilterOpen.value = !isFilterOpen.value
}

watch([localGender, localMinAge, localMaxAge], (): void => {
  emit('change')
})

function clearFilters (): void {
  localGender.value = null
  localMinAge.value = undefined
  localMaxAge.value = undefined
}
</script>
