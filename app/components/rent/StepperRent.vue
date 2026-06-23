<template>
  <div class="w-full flex flex-col items-stretch">
    <!-- Stepper from Volt framework -->
    <Stepper
      v-model:value="activeStep"
      :pt="{
        root: 'flex flex-col',
        separator: 'hidden'
      }"
      class="w-full">
      <!-- Premium Responsive Stepper Indicator -->
      <div class="stepper-indicator relative flex flex-col items-center w-full max-w-xl mx-auto mb-10 px-2 select-none">
        <!-- Stepper Line Connector Track -->
        <div class="absolute top-[18px] sm:top-[22px] left-6 right-6 h-1 bg-slate-100 dark:bg-slate-800 z-0 rounded-full" />

        <!-- Stepper Animated Brand Gradient Progress Line -->
        <div
          :style="{ width: progressBarWidth }"
          class="absolute top-[18px] sm:top-[22px] left-6 h-1 bg-gradient-primary transition-all duration-500 ease-out z-0 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.2)]" />

        <!-- Step List Container from Volt -->
        <StepList
          :pt="{
            root: 'relative z-10 w-full border-none p-0 bg-transparent flex justify-between items-center overflow-visible list-none m-0'
          }">
          <Step
            v-for="step in steps"
            :key="step.value"
            :pt="{
              root: 'flex-initial p-0 gap-0 items-center'
            }"
            :value="step.value"
            as-child>
            <button
              class="stepper-step-btn flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none group relative z-10 bg-transparent border-none p-0"
              type="button"
              @click="goToStep(step.value)">
              <!-- Step Ring Node -->
              <div
                :class="[
                  'w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-500 border-2 font-bold text-xs sm:text-sm relative z-20',
                  activeStep === step.value
                    ? 'bg-gradient-primary border-none border-transparent text-white shadow-lg shadow-indigo-500/20 scale-110 ring-4 ring-indigo-500/15 dark:ring-indigo-400/20'
                    : activeStep > step.value
                      ? 'bg-gradient-primary border-none border-transparent text-white shadow-md shadow-indigo-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500 group-hover:border-slate-350 dark:group-hover:border-slate-700'
                ]">
                <!-- Success check icon for completed steps -->
                <i
                  v-if="activeStep > step.value"
                  class="pi pi-check text-xs text-white" />
                <!-- Standard step icon otherwise -->
                <i
                  v-else
                  :class="[step.icon, 'text-xs sm:text-sm', activeStep === step.value ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors']" />
              </div>

              <!-- Step Title label (Desktop Only) -->
              <span
                :class="[
                  'hidden sm:block text-xs font-bold transition-all duration-300 whitespace-nowrap uppercase tracking-wider',
                  activeStep === step.value
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent font-black scale-105'
                    : activeStep > step.value
                      ? 'text-indigo-500 dark:text-indigo-400 font-bold'
                      : 'text-slate-400 dark:text-slate-600 font-semibold'
                ]">{{ step.label }}</span>
            </button>
          </Step>
        </StepList>

        <!-- High-End Compact Mobile Step Subtitle Indicator -->
        <div class="sm:hidden text-center mt-4.5 px-4 py-1 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 dark:from-sky-500/5 dark:to-purple-500/5 rounded-full border border-indigo-500/20 dark:border-indigo-500/10 shadow-2xs animate-fade-in">
          <span class="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            ขั้นตอนที่ {{ activeStep }}: {{ steps[activeStep - 1]?.label }}
          </span>
        </div>
      </div>

      <!-- Step Content Panels from Volt -->
      <StepPanels
        :pt="{
          root: 'p-0 bg-transparent'
        }">
        <StepPanel
          v-for="panel in panelConfigs"
          :key="panel.value"
          :pt="{
            root: 'bg-transparent text-surface-700 dark:text-surface-0'
          }"
          :value="panel.value">
          <TypeStep
            v-if="panel.value === 1"
            v-model="selectedServiceId"
            :services="services"
            @next="activeStep = 2" />
          <FormStep
            v-if="panel.value === 2"
            v-model:bio="bio"
            v-model:selected-expertises="selectedExpertises"
            v-model:tagline="tagline"
            @next="activeStep = 3"
            @prev="activeStep = 1" />
          <PriceStep
            v-if="panel.value === 3"
            v-model:price="price"
            v-model:response-time="responseTime"
            :selected-service="selectedService"
            @next="activeStep = 4"
            @prev="activeStep = 2" />
          <CheckStep
            v-if="panel.value === 4"
            :bio="bio"
            :expertises="selectedExpertises"
            :price="price"
            :response-time="responseTime"
            :service="selectedService"
            :tagline="tagline"
            @prev="activeStep = 3"
            @submit="handleSubmit" />
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CheckStep from './CheckStep.vue'
import FormStep from './FormStep.vue'
import PriceStep from './PriceStep.vue'
import TypeStep from './TypeStep.vue'
import Step from '~/volt/Step.vue'
import StepList from '~/volt/StepList.vue'
import StepPanel from '~/volt/StepPanel.vue'
import StepPanels from '~/volt/StepPanels.vue'
import Stepper from '~/volt/Stepper.vue'

interface RentStep {
  value: number
  icon: string
  label: string
}

interface RentServiceOption {
  id: string
  title: string
  priceLabel: string
  description: string
  icon?: string
  note?: string
  noteIcon?: string
}

interface Props {
  modelValue?: number
  services?: RentServiceOption[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  services: (): RentServiceOption[] => []
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'submit': [data: {
    service: RentServiceOption | null
    tagline: string
    bio: string
    expertises: string[]
    price: number | null
    responseTime: number
  }]
}>()

const steps: RentStep[] = [
  { value: 1, icon: 'pi pi-th-large', label: 'เลือกประเภท' },
  { value: 2, icon: 'pi pi-file-edit', label: 'กรอกโปรไฟล์' },
  { value: 3, icon: 'pi pi-bitcoin', label: 'ตั้งค่าราคา' },
  { value: 4, icon: 'pi pi-check-circle', label: 'ตรวจทาน' }
]

const panelConfigs = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 }
]

const activeStep = ref<number>(props.modelValue)
const progressBarWidth = computed((): string => {
  const percentage = (activeStep.value - 1) / (steps.length - 1)
  return `calc(${percentage} * (100% - 48px))`
})
const selectedServiceId = ref<string | null>(null)
const tagline = ref('')
const bio = ref('')
const selectedExpertises = ref<string[]>([])
const price = ref<number | null>(4)
const responseTime = ref<number>(15)

// Auto-suggest price when service changes
watch(selectedServiceId, (newId: string | null): void => {
  const service = props.services.find((s: RentServiceOption): boolean => s.id === newId)
  if (!service) return

  if (service.title.includes('ที่ปรึกษา') || service.title.toLowerCase().includes('emotional')) {
    price.value = 12
  } else {
    price.value = 4
  }
})

// Sync activeStep with prop changes
watch((): number | undefined => props.modelValue, (newVal: number | undefined): void => {
  if (newVal !== undefined && newVal !== activeStep.value) {
    activeStep.value = newVal
  }
})

// Emit step changes back to parent
watch(activeStep, (newVal: number): void => {
  emit('update:modelValue', newVal)
})

const selectedService = computed((): RentServiceOption | null => {
  return props.services.find((s: RentServiceOption): boolean => s.id === selectedServiceId.value) || null
})

function goToStep (step: number): void {
  // Only allow going back, not skipping forward
  if (step < activeStep.value) {
    activeStep.value = step
  }
}

function handleSubmit (): void {
  if (!price.value || price.value <= 0) return
  emit('submit', {
    service: selectedService.value,
    tagline: tagline.value,
    bio: bio.value,
    expertises: selectedExpertises.value,
    price: price.value,
    responseTime: responseTime.value
  })
}
</script>

<style>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Ensure Volt Stepper separator does not bleed through */
.stepper-indicator [data-pc-name="stepper"] [data-pc-section="separator"] {
  display: none !important;
}

/* Ensure Step root in header-less mode has no extraneous padding/margins */
.stepper-step-btn {
  appearance: none;
  -webkit-appearance: none;
}
</style>
