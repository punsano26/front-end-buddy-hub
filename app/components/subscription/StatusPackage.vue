<template>
  <div class="space-y-3">
    <div class="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <span class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
        <i class="pi pi-asterisk text-xs" />
      </span>
      <p>
        ตอนนี้คุณใช้แพ็คเกจ <span class="font-semibold text-slate-900 dark:text-white">ฟรี</span> · Find Match ได้ 5 ครั้ง/วัน · อัปเกรดเพื่อรับสิทธิพิเศษทันที
      </p>
    </div>

    <div class="flex flex-col gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-100/80 via-white to-amber-50/60 p-4 text-slate-900 shadow-sm md:flex-row md:items-center md:justify-between dark:border-amber-400/30 dark:from-amber-400/15 dark:via-white/10 dark:to-transparent dark:text-white dark:shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-200/70 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200">
          <i class="pi pi-crown text-base" />
        </span>
        <div>
          <p class="text-sm text-amber-700/80 dark:text-amber-100/80">
            คุณเป็นสมาชิก VIP
          </p>
          <p class="text-lg font-semibold text-slate-900 dark:text-white">
            เหลือเวลา 23 ชม. 59 นาที
          </p>
        </div>
      </div>
      <button
        class="rounded-2xl border border-amber-300/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 transition duration-300 hover:border-amber-300 hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/20"
        type="button">
        ยกเลิก VIP
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>
