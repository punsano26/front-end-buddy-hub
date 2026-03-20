<template>
  <component
    :is="tag"
    class="block w-full">
    <p
      v-if="label"
      :class="{
        'required': required,
        'bold': bold,
        'text-xs': !bold,
        'text-sm font-bold': bold
      }"
      class="mb-1">
      {{ label }}
    </p>

    <slot>
      <DatePicker
        v-bind="$attrs"
        v-model="dateOfBirthDate"
        :invalid="!!errorMessage"
        class="bg-slate-200 dark:bg-slate-900 dark:text-white"
        fluid />
    </slot>

    <div v-if="$slots.message">
      <slot name="message" />
    </div>

    <p
      v-if="errorMessage"
      class="mt-1 text-xs text-red-500 ">
      {{ errorMessage }}
    </p>

    <div
      v-if="$slots.actions"
      class="flex justify-end mt-1 text-xs">
      <slot name="actions" />
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface IProps {
  tag?: 'label' | 'div'
  label?: string
  required?: boolean
  bold?: boolean
  rules?: ((v: any) => boolean | string)[]
  showError?: boolean
}
const dateOfBirthDate = ref<Date | null>(null)
const model = defineModel<string>({ default: '' })
const props = withDefaults(defineProps<IProps>(), {
  tag: 'label',
  label: undefined,
  required: false,
  bold: false
})
watch(dateOfBirthDate, (newDate: Date | null): void => {
  if (newDate) {
    model.value = newDate.toISOString().split('T')[0] || ''
  } else {
    model.value = ''
  }
})
const errorMessage = computed((): string => {
  if (!props.showError) return ''
  if (!props.rules?.length) return ''

  for (const rule of props.rules) {
    const result = rule(model.value)
    if (result !== true) return result as string
  }

  return ''
})
</script>

<style scoped>
.required::after {
  color: red;
  content: '*';
}
.bold::after {
  color: var(--p-primary-color);
  margin-left: 4px;
}
</style>
