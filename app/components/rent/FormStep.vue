<template>
  <div class="p-3 sm:p-6 flex flex-col gap-6">
    <div class="text-center px-2">
      <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
        แนะนำตัวและระบุความถนัด
      </h2>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
        ข้อมูลแนะนำตัวเองที่น่าสนใจและชัดเจนจะช่วยให้ลูกค้าตัดสินใจจ้างคุณได้ง่ายขึ้น
      </p>
    </div>

    <div class="flex flex-col gap-5">
      <!-- Tagline -->
      <InputLabelField
        v-model="tagline"
        :rules="formRules.tagline"
        :show-error="submitted"
        label="สโลแกนหรือประโยคดึงดูดใจ"
        maxlength="60"
        placeholder="เช่น เพื่อนคุยคู่คิดเรื่องงาน, พื้นที่ปลอดภัย 24 ชม."
        bold
        required>
        <template #message>
          <div class="flex justify-end mt-1">
            <span :class="['text-[10px] font-bold', tagline.length > 50 ? 'text-rose-500 animate-pulse' : 'text-slate-400 dark:text-slate-650']">{{ tagline.length }}/50</span>
          </div>
        </template>
      </InputLabelField>

      <!-- Bio -->
      <InputLabelTextarea
        v-model="bio"
        :rules="formRules.bio"
        :show-error="submitted"
        label="แนะนำตัวสั้นๆ"
        maxlength="220"
        placeholder="อธิบายสไตล์การพูดคุย วิธีการรับฟัง หรือประสบการณ์ของคุณ..."
        rows="3"
        bold
        required>
        <template #message>
          <div class="flex justify-end mt-1">
            <span :class="['text-[10px] font-bold', bio.length > 200 ? 'text-rose-500 animate-pulse' : 'text-slate-400 dark:text-slate-650']">{{ bio.length }}/200</span>
          </div>
        </template>
      </InputLabelTextarea>

      <!-- Expertise -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">ความเชี่ยวชาญและเรื่องที่ถนัด (เลือกได้สูงสุด 5 เรื่อง)</span>
          <Badge
            :severity="selectedExpertises.length > 0 ? 'success' : 'secondary'"
            :value="selectedExpertises.length + ' / 5'"
            class="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-gradient-to-r from-sky-400/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10" />
        </div>

        <div class="flex flex-wrap gap-2 pt-1.5">
          <button
            v-for="option in expertiseOptions"
            :key="option"
            :class="[
              'px-3.5 py-2 rounded-full border text-xs font-bold transition-all duration-300 flex items-center gap-1.5 active:scale-95',
              selectedExpertises.includes(option)
                ? 'bg-gradient-primary border-transparent text-white shadow-md shadow-indigo-500/10 scale-[1.03] cursor-pointer'
                : selectedExpertises.length >= 5
                  ? 'bg-slate-50 border-slate-100 text-slate-300 dark:bg-slate-900/30 dark:border-slate-900 dark:text-slate-605 cursor-not-allowed opacity-50'
                  : 'bg-slate-50/50 border-slate-200/80 text-slate-650 hover:border-indigo-500/30 hover:bg-slate-100 hover:text-indigo-600 dark:bg-slate-950 dark:border-slate-800/80 dark:text-slate-350 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900 cursor-pointer shadow-2xs'
            ]"
            type="button"
            @click="toggleExpertise(option)">
            <i
              v-if="selectedExpertises.includes(option)"
              class="pi pi-times text-[9px] text-white animate-scale-up" />
            {{ option }}
          </button>

          <!-- Inline Input for custom tag -->
          <div
            v-if="isAddingCustomTag"
            class="flex items-center">
            <input
              ref="customTagInputRef"
              v-model="customTagInput"
              class="px-3.5 py-1.5 rounded-full border border-indigo-500 text-xs font-bold focus:outline-hidden dark:bg-slate-950 dark:text-white max-w-[120px]"
              maxlength="20"
              placeholder="ระบุแท็ก..."
              type="text"
              @blur="submitCustomTag"
              @keydown.enter="submitCustomTag"
              @keydown.esc="cancelCustomTag">
          </div>

          <!-- "+ เพิ่มแท็ก" Mini Button -->
          <button
            v-else
            :disabled="selectedExpertises.length >= 5"
            class="px-3.5 py-1.5 rounded-full border border-dashed border-indigo-500/60 text-indigo-600 hover:bg-indigo-500/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95 cursor-pointer dark:text-indigo-400 dark:border-indigo-500/40"
            type="button"
            @click="startAddingCustomTag">
            <i class="pi pi-plus text-[10px]" />
            เพิ่มแท็ก
          </button>
        </div>

        <p
          v-if="submitted && selectedExpertises.length === 0"
          class="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
          <span>⚠️</span> โปรดเลือกอย่างน้อย 1 ความเชี่ยวชาญ
        </p>
      </div>
    </div>

    <Divider class="!my-2 border-slate-200/50 dark:border-slate-800/60" />

    <!-- Actions block -->
    <div class="flex items-center justify-between gap-3 pt-2">
      <Button
        class="text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-xl px-4 py-2"
        icon="pi pi-arrow-left"
        label="ย้อนกลับ"
        severity="secondary"
        text
        @click="$emit('prev')" />
      <Button
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl px-5 py-2.5 bg-gradient-primary border-none text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm font-extrabold cursor-pointer"
        @click="nextStep" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputLabelField from '~/components/input/InputLabelField.vue'
import InputLabelTextarea from '~/components/input/InputLabelTextarea.vue'
import type { IFindAllRentTagsData } from '~/models/response/RentRes.model'
import { validate, validateForm } from '~/plugins/Validate'
import RentProvider, { type IRentProvider } from '~/resource/provider/Rent.provider'
import Badge from '~/volt/Badge.vue'
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'

const tagline = defineModel<string>('tagline', { default: '' })
const bio = defineModel<string>('bio', { default: '' })
const selectedExpertises = defineModel<string[]>('selectedExpertises', { default: (): string[] => [] })

const emit = defineEmits<{
  next: []
  prev: []
}>()

const rentService: IRentProvider = new RentProvider()
const { $handleLoading } = useNuxtApp()
const toast = useToast()
const submitted = ref(false)

const customTagInputRef = ref<HTMLInputElement | null>(null)
const isAddingCustomTag = ref<boolean>(false)
const customTagInput = ref<string>('')
let isSubmitting = false

function startAddingCustomTag (): void {
  if (selectedExpertises.value.length >= 5) {
    toast.add({ severity: 'warn', summary: 'คำเตือน', detail: 'เลือกความเชี่ยวชาญได้ไม่เกิน 5 อย่าง', life: 3000 })
    return
  }
  isAddingCustomTag.value = true
  nextTick((): void => {
    customTagInputRef.value?.focus()
  })
}

async function submitCustomTag (): Promise<void> {
  if (isSubmitting) return
  isSubmitting = true
  try {
    const tagName = customTagInput.value.trim()
    if (!tagName) {
      cancelCustomTag()
      return
    }

    // Check if tag already exists in options (case insensitive)
    const existingOption = expertiseOptions.value.find((opt: string): boolean => opt.toLowerCase() === tagName.toLowerCase())
    const finalTagName = existingOption || tagName

    // Check if already selected
    if (selectedExpertises.value.includes(finalTagName)) {
      toast.add({ severity: 'info', summary: 'ข้อมูล', detail: 'เลือกแท็กนี้อยู่แล้ว', life: 3000 })
      cancelCustomTag()
      return
    }

    // Check cap
    if (selectedExpertises.value.length >= 5) {
      toast.add({ severity: 'warn', summary: 'คำเตือน', detail: 'เลือกความเชี่ยวชาญได้ไม่เกิน 5 อย่าง', life: 3000 })
      cancelCustomTag()
      return
    }

    let success = false
    // Call API to create/register custom tag
    await $handleLoading(
      async (): Promise<void> => {
        await rentService.createTagsRent({ name: finalTagName })
        await onGetAllRentTags()

        const matchedTag = expertiseOptions.value.find((opt: string): boolean => opt.toLowerCase() === finalTagName.toLowerCase()) || finalTagName
        if (!selectedExpertises.value.includes(matchedTag)) {
          selectedExpertises.value.push(matchedTag)
        }
        success = true
      }, {
        toast: {
          instance: toast,
          success: {
            detail: 'เพิ่มแท็กใหม่สำเร็จ'
          }
        }
      }
    )

    if (success) {
      cancelCustomTag()
    } else {
      isAddingCustomTag.value = false
      customTagInput.value = ''
    }
  } finally {
    isSubmitting = false
  }
}

function cancelCustomTag (): void {
  isAddingCustomTag.value = false
  customTagInput.value = ''
}

const form = computed((): { tagline: string, bio: string, selectedExpertises: string[] } => ({
  tagline: tagline.value,
  bio: bio.value,
  selectedExpertises: selectedExpertises.value
}))

const formRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  tagline: [
    validate.required,
    (v: string): boolean | string => validate.maxLength(v, 50)
  ],
  bio: [
    validate.required,
    (v: string): boolean | string => validate.maxLength(v, 200)
  ],
  selectedExpertises: [
    (v: string[]): boolean | string => validate.atLeast(v, 1)
  ]
}))

const expertiseOptions = ref<string[]>([])

async function onGetAllRentTags (): Promise<void> {
  const response = await rentService.findAllRentTags()
  if (response && response.data) {
    expertiseOptions.value = response.data.map((tag: IFindAllRentTagsData): string => tag.name)
  }
}

function getAllRentTags (): void {
  $handleLoading(onGetAllRentTags, {
    toast: {
      instance: toast
    }
  })
}

function toggleExpertise (option: string): void {
  const index = selectedExpertises.value.indexOf(option)
  if (index !== -1) {
    selectedExpertises.value.splice(index, 1)
  } else if (selectedExpertises.value.length < 5) {
    selectedExpertises.value.push(option)
  }
}

function nextStep (): void {
  submitted.value = true
  if (!validateForm(form.value, formRules.value)) {
    return
  }
  emit('next')
}

onMounted((): void => {
  getAllRentTags()
})
</script>
