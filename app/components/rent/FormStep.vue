<template>
  <div class="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        แนะนำตัวและระบุความถนัด
      </h2>
    </div>

    <div class="flex flex-col gap-5">
      <!-- Tagline -->
      <InputLabelField
        v-model="tagline"
        :rules="[
          (v: string) => v.length <= 50 || 'ข้อมูลต้องยาวไม่เกิน 50 ตัวอักษร'
        ]"
        :show-error="tagline.length > 50"
        label="สโลแกนหรือประโยคดึงดูดใจ"
        maxlength="60"
        placeholder="เช่น เพื่อนคุยคู่คิดเรื่องงาน, พื้นที่ปลอดภัย 24 ชม."
        bold
        required>
        <template #message>
          <div class="flex justify-end mt-1">
            <span :class="['text-[10px]', tagline.length > 50 ? 'text-red-500' : 'text-slate-500 dark:text-slate-600']">{{ tagline.length }}/50</span>
          </div>
        </template>
      </InputLabelField>

      <!-- Bio -->
      <InputLabelTextarea
        v-model="bio"
        :rules="[
          (v: string) => v.length <= 200 || 'ข้อมูลต้องยาวไม่เกิน 200 ตัวอักษร'
        ]"
        :show-error="bio.length > 200"
        label="แนะนำตัวสั้นๆ"
        maxlength="220"
        placeholder="อธิบายสไตล์การพูดคุย วิธีการรับฟัง หรือประสบการณ์ของคุณ..."
        rows="3"
        bold
        required>
        <template #message>
          <div class="flex justify-end mt-1">
            <span :class="['text-[10px]', bio.length > 200 ? 'text-red-500' : 'text-slate-500 dark:text-slate-600']">{{ bio.length }}/200</span>
          </div>
        </template>
      </InputLabelTextarea>

      <!-- Expertise -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">ความเชี่ยวชาญและเรื่องที่ถนัด</span>
          <Badge
            :value="selectedExpertises.length + '/5'"
            severity="secondary" />
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in expertiseOptions"
            :key="option"
            :class="[
              'px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200',
              selectedExpertises.includes(option)
                ? 'bg-emerald-50 border-emerald-400 text-white shadow-sm scale-105 cursor-pointer'
                : selectedExpertises.length >= 5
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-600'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-700 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-300'
            ]"
            type="button"
            @click="toggleExpertise(option)">
            {{ option }}
          </button>
        </div>
        <p
          v-if="selectedExpertises.length === 0"
          class="text-[10px] text-red-500">
          * โปรดเลือกอย่างน้อย 1 ความเชี่ยวชาญ
        </p>
      </div>
    </div>

    <Divider />

    <div class="flex items-center justify-between">
      <Button
        icon="pi pi-arrow-left"
        label="ย้อนกลับ"
        severity="secondary"
        text
        @click="$emit('prev')" />
      <Button
        :disabled="!tagline || !bio || tagline.length > 50 || bio.length > 200 || selectedExpertises.length === 0"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl"
        @click="tagline && bio && tagline.length <= 50 && bio.length <= 200 && selectedExpertises.length > 0 && $emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InputLabelField from '~/components/input/InputLabelField.vue'
import InputLabelTextarea from '~/components/input/InputLabelTextarea.vue'
import Badge from '~/volt/Badge.vue'
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'

const tagline = defineModel<string>('tagline', { default: '' })
const bio = defineModel<string>('bio', { default: '' })
const selectedExpertises = defineModel<string[]>('selectedExpertises', { default: (): string[] => [] })

defineEmits<{
  next: []
  prev: []
}>()

const expertiseOptions = [
  'ความรัก', 'ความสัมพันธ์', 'การเลิกรา', 'การเรียน', 'การทำงาน',
  'ครอบครัว', 'พัฒนาตนเอง', 'ความเครียด', 'คุยแก้เหงา', 'สุขภาพจิต'
]

function toggleExpertise (option: string): void {
  const index = selectedExpertises.value.indexOf(option)
  if (index !== -1) {
    selectedExpertises.value.splice(index, 1)
  } else if (selectedExpertises.value.length < 5) {
    selectedExpertises.value.push(option)
  }
}
</script>
