<template>
  <div class="h-full flex flex-col items-center justify-center overflow-hidden p-6 bg-slate-50 dark:bg-slate-950/40 relative">
    <!-- Background subtle gradient glow -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-500/5 dark:bg-blue-600/5 blur-3xl animate-pulse" />
    </div>

    <div class="max-w-md text-center flex flex-col items-center">
      <!-- Icon Container with primary gradient -->
      <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary text-white shadow-lg mb-6 transform hover:scale-105 transition duration-300">
        <i class="pi pi-comments text-2xl" />
      </div>

      <h1 class="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
        ยินดีต้อนรับสู่บริการเช่าเพื่อนคุย
      </h1>
      
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        เริ่มต้นบทสนทนากับเพื่อนคุยออนไลน์ที่คุณสนใจ เพื่อรับคำปรึกษา แลกเปลี่ยนความคิดเห็น เล่นเกม หรือเม้าท์มอยเรื่องราวในวันสบายๆ
      </p>

      <div class="hidden md:flex flex-col items-center gap-2 text-xs text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-800/80 rounded-xl px-4 py-3 bg-white dark:bg-slate-900/40 shadow-sm">
        <div class="flex items-center gap-1.5">
          <i class="pi pi-arrow-left animate-bounce" style="animation-direction: alternate;" />
          <span>เลือกเพื่อนคุยจากรายการด้านซ้ายเพื่อเปิดแชท</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "chat-rent", title: "แชท" });
</script>

<style scoped>
</style>