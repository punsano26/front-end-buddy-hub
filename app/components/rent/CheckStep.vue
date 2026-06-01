<template>
  <div class="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
    <div class="text-center px-2">
      <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
        <i class="pi pi-check-circle text-emerald-500 text-lg" />
        ตรวจสอบความถูกต้องของข้อมูล
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        โปรดตรวจสอบข้อมูลบริการของคุณให้ละเอียดก่อนยืนยันเปิดรับเช่าสาย
      </p>
    </div>

    <!-- Review Content Card -->
    <div class="w-full bg-slate-50/50 dark:bg-slate-800/10 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-7 flex flex-col gap-4 sm:gap-5 shadow-inner">
      <!-- 1. Service Row -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <i class="pi pi-tag text-emerald-500 text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500">ประเภทบริการ</span>
        </div>
        <span class="text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
          {{ service?.title }}
        </span>
      </div>

      <!-- 2. Tagline Row -->
      <div class="flex flex-col gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <i class="pi pi-comment text-indigo-500 text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500">สโลแกนดึงดูดใจ</span>
        </div>
        <div class="text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 leading-relaxed">
          {{ tagline }}
        </div>
      </div>

      <!-- 3. Bio Row -->
      <div class="flex flex-col gap-1.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <i class="pi pi-file-edit text-indigo-500 text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500">แนะนำตัวสั้นๆ</span>
        </div>
        <div class="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/50 dark:border-slate-800 leading-relaxed whitespace-pre-wrap">
          {{ bio }}
        </div>
      </div>

      <!-- 4. Expertise Row -->
      <div class="flex flex-col gap-2.5 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
            <i class="pi pi-heart text-teal-500 text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500">ความเชี่ยวชาญและเรื่องที่ถนัด</span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="exp in expertises"
            :key="exp"
            class="px-2.5 py-1 bg-teal-50/80 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50 rounded-full text-xs font-semibold">
            {{ exp }}
          </span>
        </div>
      </div>

      <!-- 5. Settings Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Rate Box -->
        <div class="flex items-center justify-between p-3.5 bg-amber-500/[0.04] border border-amber-500/20 rounded-2xl gap-3">
          <div class="flex items-center gap-2">
            <i class="pi pi-bitcoin text-amber-500 text-xl animate-bounce" />
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">เรตต่อนาที</span>
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">อัตราค่าบริการ</span>
            </div>
          </div>
          <span class="text-lg font-black text-amber-600 dark:text-amber-400">
            {{ price }} เหรียญ
          </span>
        </div>

        <!-- Response Time Box -->
        <div class="flex items-center justify-between p-3.5 bg-indigo-500/[0.04] border border-indigo-500/20 rounded-2xl gap-3">
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-indigo-500 text-xl" />
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold">เวลาตอบกลับ</span>
              <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">เฉลี่ยภายใน</span>
            </div>
          </div>
          <span class="text-lg font-black text-indigo-600 dark:text-indigo-400">
            {{ responseTime }} นาที
          </span>
        </div>
      </div>
    </div>

    <!-- Platform Fee Info Notice -->
    <div class="p-3.5 bg-emerald-500/[0.05] border border-emerald-500/10 rounded-2xl text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2 items-start shadow-xs">
      <span class="text-emerald-500 text-xs">🛡️</span>
      <div>
        <span class="font-bold text-slate-700 dark:text-slate-300">นโยบายแพลตฟอร์ม: </span>
        การให้บริการเป็นเพื่อนรับฟังถือเป็นพื้นที่ปลอดภัย ยึดหลักการรักษาความลับ ความเป็นส่วนตัวของลูกค้า และปฏิบัติตามมาตรฐานชุมชนอย่างเคร่งครัด
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
        icon="pi pi-check"
        label="ยืนยันและเปิดรับเช่า"
        pt:root:class="!rounded-xl bg-gradient-primary border-none shadow-lg text-white"
        @click="$emit('submit')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'

interface RentServiceOption {
  id: string
  title: string
  priceLabel: string
  description: string
  icon?: string
  note?: string
  noteIcon?: string
}

defineProps<{
  service: RentServiceOption | null
  tagline: string
  bio: string
  expertises: string[]
  price: number | null
  responseTime: number
}>()

defineEmits<{
  prev: []
  submit: []
}>()
</script>
