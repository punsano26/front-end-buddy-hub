<template>
  <div class="min-h-screen flex flex-col items-center justify-start py-10 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <!-- Header -->
    <div class="flex flex-col items-center gap-2 mb-8">
      <div class="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <i class="pi pi-heart text-2xl text-emerald-400" />
      </div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
        เปิดรับเช่าคุย
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        สร้างรายได้จากการเป็นเพื่อนคุยและผู้รับฟังที่ดี
      </p>
    </div>

    <!-- Stepper indicator -->
    <div class="flex items-center gap-0 mb-8 w-full max-w-md px-4">
      <template
        v-for="(step, idx) in steps"
        :key="step.value">
        <button
          :class="[
            'flex flex-col items-center gap-1.5 flex-1 cursor-pointer group transition-all'
          ]"
          type="button"
          @click="goToStep(step.value)">
          <div
            :class="[
              'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 border',
              activeStep === step.value
                ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-110 text-white'
                : activeStep > step.value
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900/60 dark:border-emerald-700 dark:text-emerald-400'
                  : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
            ]">
            <i
              v-if="activeStep > step.value"
              class="pi pi-check text-emerald-400 text-sm" />
            <i
              v-else
              :class="[step.icon, 'text-sm', activeStep === step.value ? 'text-white' : '']" />
          </div>
          <span
            :class="[
              'text-[10px] font-semibold transition-colors',
              activeStep === step.value
                ? 'text-emerald-600 dark:text-emerald-400'
                : activeStep > step.value
                  ? 'text-emerald-700 dark:text-emerald-600'
                  : 'text-slate-500 dark:text-slate-600'
            ]">{{ step.label }}</span>
        </button>
        <div
          v-if="idx < steps.length - 1"
          :class="[
            'h-0.5 flex-1 mx-1 rounded-full transition-all duration-500 mb-5',
            activeStep > step.value ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
          ]" />
      </template>
    </div>

    <!-- Card container -->
    <div class="w-full max-w-4xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
      <!-- Step Components Delegation -->
      <TypeStep
        v-if="activeStep === 1"
        v-model="selectedServiceId"
        :services="services"
        @next="activeStep = 2" />

      <FormStep
        v-if="activeStep === 2"
        v-model:bio="bio"
        v-model:selected-expertises="selectedExpertises"
        v-model:tagline="tagline"
        @next="activeStep = 3"
        @prev="activeStep = 1" />

      <PriceStep
        v-if="activeStep === 3"
        v-model:price="price"
        v-model:response-time="responseTime"
        :selected-service-id="selectedServiceId"
        @next="activeStep = 4"
        @prev="activeStep = 2" />

      <CheckStep
        v-if="activeStep === 4"
        :bio="bio"
        :expertises="selectedExpertises"
        :price="price"
        :response-time="responseTime"
        :service="selectedService"
        :tagline="tagline"
        @prev="activeStep = 3"
        @submit="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TypeStep from './TypeStep.vue'
import FormStep from './FormStep.vue'
import PriceStep from './PriceStep.vue'
import CheckStep from './CheckStep.vue'

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
  services: (): RentServiceOption[] => [
    {
      id: 'casual-friend',
      title: 'เพื่อนคุยทั่วไป (Casual Friend)',
      priceLabel: '4-10 เหรียญ/นาที',
      description: 'บริการเพื่อนคุยทั่วไปสำหรับผู้ที่ต้องการพูดคุยและแชร์ประสบการณ์ชีวิต',
      icon: 'pi pi-comments'
    },
    {
      id: 'emotional-support',
      title: 'ที่ปรึกษาทางใจ (Emotional Support)',
      priceLabel: '12-21 เหรียญ/นาที',
      description: 'รับฟังและให้คำปรึกษาในเรื่องส่วนตัว เช่น ความเครียด ความสัมพันธ์ หรือปัญหาชีวิตต่างๆ โดยไม่ตัดสินและเป็นความลับ',
      note: 'ข้อมูลส่วนตัวจะถูกเก็บเป็นความลับและไม่ถูกเปิดเผย',
      noteIcon: 'pi pi-shield',
      icon: 'pi pi-heart'
    }
  ]
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
  { value: 2, icon: 'pi pi-file-edit', label: 'โปรไฟล์' },
  { value: 3, icon: 'pi pi-bitcoin', label: 'ตั้งราคา' },
  { value: 4, icon: 'pi pi-check-circle', label: 'ตรวจสอบ' }
]

const activeStep = ref<number>(props.modelValue)
const selectedServiceId = ref<string | null>(null)
const tagline = ref('')
const bio = ref('')
const selectedExpertises = ref<string[]>([])
const price = ref<number | null>(4)
const responseTime = ref<number>(15)

// Auto-suggest price when service changes
watch(selectedServiceId, (newId: string | null): void => {
  if (newId === 'casual-friend') {
    price.value = 4
  } else if (newId === 'emotional-support') {
    price.value = 12
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
