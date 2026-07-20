<template>
  <Stepper
    v-model:value="activeStepValue"
    :class="props.class">
    <StepList>
      <Step
        v-for="(step, index) in props.steps"
        :key="step.value"
        v-slot="{ activateCallback, value, a11yAttrs }"
        :value="step.value"
        as-child>
        <div
          class="flex flex-row flex-auto items-center gap-3"
          v-bind="a11yAttrs.root">
          <button
            class="bg-transparent border-0 inline-flex flex-col gap-2 cursor-pointer"
            type="button"
            v-bind="a11yAttrs.header"
            @click="activateCallback">
            <span
              :class="[
                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center transition-all duration-300',
                value <= activeStepValue
                  ? 'bg-primary text-primary-contrast border-primary'
                  : 'border-surface-200 dark:border-surface-700 text-surface-500'
              ]">
              <i :class="step.icon" />
            </span>
          </button>
          <div
            v-if="index < props.steps.length - 1"
            :class="[
              'flex-1 h-px rounded-full transition-colors duration-300',
              step.value < activeStepValue
                ? 'bg-primary'
                : 'bg-surface-200 dark:bg-surface-700'
            ]" />
        </div>
      </Step>
    </StepList>

    <StepPanels>
      <StepPanel
        v-for="step in props.steps"
        :key="step.value"
        v-slot="{ activateCallback }"
        :value="step.value">
        <slot
          :activate-callback="activateCallback"
          :name="`step-${step.value}`" />
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Step from '~/volt/Step.vue'
import StepList from '~/volt/StepList.vue'
import StepPanel from '~/volt/StepPanel.vue'
import StepPanels from '~/volt/StepPanels.vue'
import Stepper from '~/volt/Stepper.vue'

interface IStepConfig {
  value: number
  icon: string
}

interface IProps {
  modelValue?: number
  steps?: IStepConfig[]
  class?: string
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: 1,
  steps: (): IStepConfig[] => [],
  class: 'basis-[40rem]'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const activeStepValue = computed({
  get: (): number => props.modelValue,
  set: (val: number): void => {
    emit('update:modelValue', val)
  }
})
</script>
