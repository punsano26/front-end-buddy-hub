<template>
  <div class="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
    <div class="text-center">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        เลือกประเภทบริการของคุณ
      </h2>
    </div>

    <div class="flex flex-col gap-3">
      <button
        v-for="service in services"
        :key="service.id"
        :class="[
          'w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer',
          'bg-white text-slate-900',
          'dark:bg-slate-800/50 dark:text-slate-100',
          modelValue === service.id
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md shadow-emerald-500/10'
            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800'
        ]"
        type="button"
        @click="selectService(service.id)">
        <div class="flex gap-3 items-start">
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
              modelValue === service.id ? 'bg-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700'
            ]">
            <i :class="[service.icon ?? 'pi pi-comments', 'text-lg', modelValue === service.id ? 'text-emerald-400' : 'text-slate-500 dark:text-slate-400']" />
          </div>
          <div class="flex flex-col gap-1 flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-sm text-slate-900 dark:text-white">{{ service.title }}</span>
              <Tag
                :class="[
                  modelValue === service.id
                    ? '!bg-emerald-500/20 !text-emerald-600 dark:!text-emerald-300 border border-emerald-500/40'
                    : '!bg-slate-100 !text-slate-600 border border-slate-200 dark:!bg-slate-700 dark:!text-slate-400 dark:border-slate-600'
                ]"
                :value="service.priceLabel"
                rounded />
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ service.description }}
            </p>
            <p
              v-if="service.note"
              class="text-[10px] text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-0.5">
              <i :class="service.noteIcon ?? 'pi pi-info-circle'" />
              {{ service.note }}
            </p>
          </div>
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all',
              modelValue === service.id ? 'border-emerald-400 bg-emerald-400' : 'border-slate-300 dark:border-slate-600'
            ]" />
        </div>
      </button>
    </div>

    <Divider />

    <div class="flex items-center justify-between">
      <Button
        :disabled="true"
        icon="pi pi-arrow-left"
        label="ยกเลิก"
        severity="secondary"
        text />
      <Button
        :disabled="!modelValue"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl"
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
