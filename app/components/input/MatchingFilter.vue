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
                :allow-empty="false"
                :invalid="!!minAgeError"
                :max="maxAge || 100"
                :min="16"
                class="w-full" />
              <template #message>
                <p
                  v-if="minAgeError"
                  class="mt-1 text-xs text-red-500">
                  {{ minAgeError }}
                </p>
              </template>
            </InputLabelField>


            <InputLabelField label="อายุสูงสุด">
              <InputNumber
                v-model="maxAge"
                :allow-empty="false"
                :invalid="!!maxAgeError"
                :max="100"
                :min="minAge || 16"
                class="w-full" />
              <template #message>
                <p
                  v-if="maxAgeError"
                  class="mt-1 text-xs text-red-500">
                  {{ maxAgeError }}
                </p>
              </template>
            </InputLabelField>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { genderQueryEnum } from '~/models/enums/User.enum'
import type { IJoinTheRandomMatchQueuePayload } from '~/models/request/MatchReq.model'
import { validate } from '~/plugins/Validate'

interface IProps {
  payload: IJoinTheRandomMatchQueuePayload
  showError?: boolean
  rules?: Partial<Record<keyof IJoinTheRandomMatchQueuePayload, ((v: any) => boolean | string)[]>>
}

const props = withDefaults(defineProps<IProps>(), {
  showError: false,
  rules: undefined
})

const emit = defineEmits<{
  (event: 'update:payload', value: IJoinTheRandomMatchQueuePayload): void
}>()

const genderOptions = [
  { label: 'ทั้งหมด', value: genderQueryEnum.ALL },
  { label: 'ผู้ชาย', value: genderQueryEnum.MALE },
  { label: 'ผู้หญิง', value: genderQueryEnum.FEMALE },
  { label: 'อื่นๆ', value: genderQueryEnum.OTHER }
]

const updatePayload = (patch: Partial<IJoinTheRandomMatchQueuePayload>): void => {
  emit('update:payload', { ...props.payload, ...patch })
}

const genderValue = computed<genderQueryEnum>({
  get: (): genderQueryEnum => props.payload.gender,
  set: (value: genderQueryEnum): void => updatePayload({ gender: value })
})

const minAge = computed<number | null>({
  get: (): number => props.payload.minAge,
  set: (value: number | null): void => {
    updatePayload({ minAge: typeof value === 'number' && !Number.isNaN(value) ? value : (value as any) })
  }
})

const maxAge = computed<number | null>({
  get: (): number => props.payload.maxAge,
  set: (value: number | null): void => {
    updatePayload({ maxAge: typeof value === 'number' && !Number.isNaN(value) ? value : (value as any) })
  }
})

const defaultRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  minAge: [
    validate.required,
    (val: any): boolean | string => validate.minValue(val, 16),
    (val: any): boolean | string => {
      if (props.payload.maxAge && Number(val) > Number(props.payload.maxAge)) {
        return 'อายุต่ำสุดต้องไม่มากกว่าอายุสูงสุด'
      }
      return true
    }
  ],
  maxAge: [
    validate.required,
    (val: any): boolean | string => validate.maxValue(val, 100),
    (val: any): boolean | string => {
      if (props.payload.minAge && Number(val) < Number(props.payload.minAge)) {
        return 'อายุสูงสุดต้องไม่น้อยกว่าอายุต่ำสุด'
      }
      return true
    }
  ]
}))

const activeRules = computed((): Record<string, ((v: any) => boolean | string)[]> => {
  return (props.rules as Record<string, ((v: any) => boolean | string)[]>) || defaultRules.value
})

const minAgeError = computed((): string => {
  if (!props.showError) return ''
  const rules = activeRules.value.minAge || []
  for (const rule of rules) {
    const res = rule(props.payload.minAge)
    if (res !== true) return res as string
  }
  return ''
})

const maxAgeError = computed((): string => {
  if (!props.showError) return ''
  const rules = activeRules.value.maxAge || []
  for (const rule of rules) {
    const res = rule(props.payload.maxAge)
    if (res !== true) return res as string
  }
  return ''
})
</script>

<style>

</style>
