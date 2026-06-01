<template>
  <div class="p-3 sm:p-6 flex flex-col gap-6">
    <div class="text-center px-2">
      <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center justify-center gap-2">
        <i class="pi pi-check-circle text-indigo-550 text-base sm:text-lg" />
        ตรวจสอบความถูกต้องของข้อมูล
      </h2>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
        กรุณาตรวจทานรายละเอียดบริการทั้งหมดก่อนกดยืนยันเพื่อเริ่มรับสายเพื่อนคุย
      </p>
    </div>

    <!-- Ticket-style Review Content Card -->
    <div class="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col gap-5 shadow-2xs relative overflow-hidden">
      <!-- Glow accent inside ticket -->
      <div class="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-tr from-sky-400/5 to-indigo-500/5 rounded-full blur-xl pointer-events-none" />

      <!-- 1. Service Row -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-150 dark:border-slate-850 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8.5 h-8.5 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <i class="pi pi-tag text-sky-500 text-xs sm:text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ประเภทบริการ</span>
        </div>
        <span class="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-1 rounded-xl border border-indigo-500/10 shadow-3xs">
          {{ service?.title }}
        </span>
      </div>

      <!-- 2. Tagline Row -->
      <div class="flex flex-col gap-2.5 border-b border-slate-150 dark:border-slate-850 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8.5 h-8.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <i class="pi pi-comment text-indigo-500 text-xs sm:text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">สโลแกนดึงดูดใจ</span>
        </div>
        <div class="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-850 leading-relaxed shadow-3xs">
          {{ tagline }}
        </div>
      </div>

      <!-- 3. Bio Row -->
      <div class="flex flex-col gap-2.5 border-b border-slate-150 dark:border-slate-850 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8.5 h-8.5 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <i class="pi pi-file-edit text-purple-500 text-xs sm:text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">แนะนำตัวสั้นๆ</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-850 leading-relaxed whitespace-pre-wrap shadow-3xs">
          {{ bio }}
        </div>
      </div>

      <!-- 4. Expertise Row -->
      <div class="flex flex-col gap-3 border-b border-slate-150 dark:border-slate-850 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8.5 h-8.5 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <i class="pi pi-heart text-teal-555 text-xs sm:text-sm" />
          </div>
          <span class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">ความเชี่ยวชาญและเรื่องที่ถนัด</span>
        </div>
        <div class="flex flex-wrap gap-1.5 pt-0.5">
          <span
            v-for="exp in expertises"
            :key="exp"
            class="px-3 py-1 bg-gradient-to-r from-sky-450/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 rounded-full text-[10px] sm:text-xs font-black shadow-3xs uppercase tracking-wider">
            {{ exp }}
          </span>
        </div>
      </div>

      <!-- 5. Settings Row (Grid splits beautifully on Desktop, stacks on iPhone) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Rate Box -->
        <div class="flex items-center justify-between p-4 bg-amber-500/[0.04] dark:bg-amber-400/[0.02] border border-amber-500/20 rounded-xl sm:rounded-2xl gap-3 shadow-3xs">
          <div class="flex items-center gap-2.5">
            <i class="pi pi-bitcoin text-amber-500 text-xl animate-bounce" />
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-wider">เรตต่อนาที</span>
              <span class="text-xs font-bold text-slate-550 dark:text-slate-400">อัตราค่าบริการ</span>
            </div>
          </div>
          <span class="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
            {{ price }} เหรียญ
          </span>
        </div>

        <!-- Response Time Box -->
        <div class="flex items-center justify-between p-4 bg-indigo-500/[0.04] dark:bg-indigo-400/[0.02] border border-indigo-500/20 rounded-xl sm:rounded-2xl gap-3 shadow-3xs">
          <div class="flex items-center gap-2.5">
            <i class="pi pi-clock text-indigo-500 text-xl animate-pulse" />
            <div class="flex flex-col">
              <span class="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-wider">เวลาตอบกลับ</span>
              <span class="text-xs font-bold text-slate-550 dark:text-slate-400">เฉลี่ยภายใน</span>
            </div>
          </div>
          <span class="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
            {{ responseTime }} นาที
          </span>
        </div>
      </div>
    </div>

    <!-- Platform Fee Info Notice -->
    <div class="p-4 bg-gradient-to-r from-sky-500/[0.04] to-indigo-500/[0.04] dark:from-sky-500/[0.02] dark:to-indigo-500/[0.02] border border-indigo-500/10 rounded-xl sm:rounded-2xl text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed flex gap-2 items-start shadow-3xs">
      <span class="text-indigo-500 text-xs sm:text-sm shrink-0">🛡️</span>
      <div>
        <span class="font-black text-slate-700 dark:text-slate-350">นโยบายแพลตฟอร์ม: </span>
        การให้บริการเป็นเพื่อนรับฟังถือเป็นพื้นที่ปลอดภัย ยึดหลักการรักษาความลับ ความเป็นส่วนตัวของลูกค้า และปฏิบัติตามมาตรฐานชุมชนอย่างเคร่งครัด
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
        icon="pi pi-check"
        label="ยืนยันและเปิดรับเช่า"
        pt:root:class="!rounded-xl px-5 py-2.5 bg-gradient-primary border-none text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-xs sm:text-sm font-extrabold cursor-pointer flex items-center gap-1.5 active:scale-95"
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
