<template>
  <Card
    pt:root:class="rounded-2xl shadow-sm bg-white/70 dark:bg-surface-800/70 backdrop-blur">
    <template #content>
      <div class="flex flex-col gap-5">
        <div>
          <h2 class="text-lg font-semibold text-surface-900 dark:text-white">
            Match Preferences
          </h2>
          <p class="text-xs text-surface-500">
            ตั้งค่าการจับคู่ของคุณ
          </p>
        </div>


        <InputLabelField label="เพศ">
          <Select
            v-model="genderValue"
            :options="genderOptions"
            class="w-full rounded-xl"
            option-label="label"
            option-value="value"
            placeholder="ทั้งหมด" />
        </InputLabelField>


        <div>
          <p class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            ช่วงอายุ
          </p>

          <div class="grid grid-cols-2 gap-3">
            <InputLabelField label="อายุต่ำสุด">
              <InputNumber
                v-model="minAge"
                :min="16"
                class="w-full" />
            </InputLabelField>


            <InputLabelField label="อายุสูงสุด">
              <InputNumber
                v-model="maxAge"
                :max="100"
                class="w-full" />
            </InputLabelField>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { genderEnum } from '~/models/enums/User.enum'
import type { IJoinTheRandomMatchQueuePayload } from '~/models/request/MatchReq.model'

const props = defineProps<{
  payload: IJoinTheRandomMatchQueuePayload
}>()

const emit = defineEmits<{
  (event: 'update:payload', value: IJoinTheRandomMatchQueuePayload): void
}>()

const genderOptions = [
  { label: 'ทั้งหมด', value: null },
  { label: 'ผู้ชาย', value: genderEnum.MALE },
  { label: 'ผู้หญิง', value: genderEnum.FEMALE },
  { label: 'อื่นๆ', value: genderEnum.OTHER }
]

const updatePayload = (patch: Partial<IJoinTheRandomMatchQueuePayload>): void => {
  emit('update:payload', { ...props.payload, ...patch })
}

const genderValue = computed<genderEnum | null>({
  get: (): genderEnum | null => props.payload.gender,
  set: (value: genderEnum | null): void => updatePayload({ gender: value })
})

const minAge = computed<number | null>({
  get: (): number => props.payload.minAge,
  set: (value: number | null): void => {
    if (typeof value === 'number') {
      updatePayload({ minAge: value })
    }
  }
})

const maxAge = computed<number | null>({
  get: (): number => props.payload.maxAge,
  set: (value: number | null): void => {
    if (typeof value === 'number') {
      updatePayload({ maxAge: value })
    }
  }
})
</script>

<style>

</style>
