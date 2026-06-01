<template>
  <div class="p-3 sm:p-6 flex flex-col gap-6">
    <div class="text-center px-2">
      <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
        เลือกประเภทบริการของคุณ
      </h2>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
        บริการแต่ละประเภทมีกลุ่มลูกค้าที่แตกต่างกัน กรุณาเลือกประเภทที่ตรงกับจุดเด่นของคุณ
      </p>
    </div>

    <!-- Selection Grid -->
    <div class="flex flex-col gap-4">
      <button
        v-for="service in services"
        :key="service.id"
        :class="[
          'w-full text-left rounded-2xl border p-5 sm:p-6 transition-all duration-300 cursor-pointer relative overflow-hidden group',
          modelValue === service.id
            ? 'border-indigo-500 dark:border-indigo-400 bg-gradient-to-r from-sky-500/[0.04] to-indigo-500/[0.04] dark:from-sky-500/[0.02] dark:to-indigo-500/[0.02] shadow-[0_10px_30px_rgba(99,102,241,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-[1.01]'
            : 'border-slate-200/80 bg-white hover:border-slate-350 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700 dark:hover:bg-slate-900/50 text-slate-900 dark:text-slate-100'
        ]"
        type="button"
        @click="selectService(service.id)">
        <!-- Glowing gradient accent on selected card -->
        <div
          v-if="modelValue === service.id"
          class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div class="flex gap-4 sm:gap-5 items-start relative z-10">
          <!-- Icon container (Sky-to-indigo themed when selected) -->
          <div
            :class="[
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-550 border',
              modelValue === service.id
                ? 'bg-gradient-to-tr from-sky-400 to-indigo-600 text-white border-transparent shadow-md shadow-indigo-500/25 scale-105'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:scale-105 group-hover:text-indigo-500 group-hover:border-indigo-500/30'
            ]">
            <i :class="[service.icon ?? 'pi pi-comments', 'text-lg sm:text-xl']" />
          </div>

          <div class="flex flex-col gap-1.5 flex-1 min-w-0">
            <!-- Title & Pricing Tag -->
            <div class="flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-3">
              <span
                :class="[
                  'font-black text-sm sm:text-base transition-colors duration-300',
                  modelValue === service.id ? 'text-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                ]">{{ service.title }}</span>
              <Tag
                :class="[
                  'self-start xs:self-auto text-[10px] px-2.5 py-0.5 border font-bold rounded-full',
                  modelValue === service.id
                    ? '!bg-indigo-500/10 !text-indigo-600 dark:!text-indigo-400 border-indigo-500/20'
                    : '!bg-slate-50 !text-slate-500 border-slate-200 dark:!bg-slate-900 dark:!text-slate-400 dark:border-slate-800'
                ]"
                :value="service.priceLabel" />
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              {{ service.description }}
            </p>

            <!-- Safe & Confidential Tag -->
            <p
              v-if="service.note"
              class="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
              <i :class="[service.noteIcon ?? 'pi pi-shield', 'text-[10px] text-indigo-500 dark:text-indigo-400']" />
              {{ service.note }}
            </p>
          </div>

          <!-- Radio selection indicator (Glassmorphic dot) -->
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300',
              modelValue === service.id
                ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'border-slate-300 dark:border-slate-700 bg-transparent group-hover:border-indigo-500/40'
            ]">
            <div
              v-if="modelValue === service.id"
              class="w-1.5 h-1.5 rounded-full bg-white animate-scale-up" />
          </div>
        </div>
      </button>
    </div>

    <Divider class="!my-2 border-slate-200/50 dark:border-slate-800/60" />

    <!-- Actions block -->
    <div class="flex items-center justify-between gap-3 pt-2">
      <Button
        :disabled="true"
        class="text-xs sm:text-sm font-bold opacity-30 cursor-not-allowed"
        icon="pi pi-arrow-left"
        label="ยกเลิก"
        severity="secondary"
        text />
      <Button
        :disabled="!modelValue"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl px-5 py-2.5 bg-gradient-primary border-none text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm font-extrabold cursor-pointer"
        @click="$emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'
import Tag from '~/volt/Tag.vue'

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
  modelValue: string | null
  services: RentServiceOption[]
}

defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'next': []
}>()

function selectService (id: string): void {
  emit('update:modelValue', id)
}
</script>

<style>
@keyframes scale-up {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-up {
  animation: scale-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
</style>
