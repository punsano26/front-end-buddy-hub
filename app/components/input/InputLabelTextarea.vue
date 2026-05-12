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
      <Textarea
        v-bind="$attrs"
        v-model="model"
        :class="[
          'bg-slate-200 dark:bg-slate-900 dark:text-white rounded-xl',
          props.compact
            ? 'compact-textarea'
            : 'default-textarea'
        ]"
        :invalid="!!errorMessage"
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

  compact?: boolean
}

const model = defineModel<string>({ default: '' })
const props = withDefaults(defineProps<IProps>(), {
  tag: 'label',
  label: undefined,
  required: false,
  bold: false,
  compact: false
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

/* DEFAULT */
:deep(.default-textarea textarea) {
  min-height: 110px;
  padding: 12px 14px;
}

/* COMPACT CHAT MODE */
:deep(.compact-textarea textarea) {
  min-height: 20px !important;
  max-height: 120px !important;

  height: 20px;

  padding: 8px 0 !important;

  line-height: 20px;

  resize: none !important;

  background: transparent !important;

  box-shadow: none !important;

  overflow-y: auto !important;
}

:deep(.compact-textarea.p-textarea),
:deep(.compact-textarea .p-inputtextarea) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
