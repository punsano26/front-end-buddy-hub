<template>
  <div class="landing-root relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-4 py-8 text-center">
    <div class="ambient ambient-cyan" />
    <div class="ambient ambient-indigo" />
    <div class="ambient ambient-vignette" />

    <div class="relative z-10 mx-auto w-full max-w-md space-y-6 rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-400 ring-1 ring-red-400/30">
        <i
          :class="is404 ? 'pi pi-compass' : 'pi pi-exclamation-triangle'"
          class="text-4xl" />
      </div>

      <div class="space-y-2">
        <p class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs tracking-[0.2em] text-white/80 uppercase">
          ERROR {{ statusCode }}
        </p>
        <h1 class="text-2xl font-black text-white sm:text-3xl">
          {{ titleText }}
        </h1>
        <p class="text-sm text-surface-200">
          {{ descriptionText }}
        </p>
      </div>

      <div class="pt-2">
        <Button
          class="w-full"
          icon="pi pi-home"
          label="กลับสู่หน้าหลัก"
          pt:root:class="w-full bg-gradient-primary border-none text-surface-900 font-semibold px-6 py-3 rounded-xl shadow-[0_20px_40px_-20px_rgba(111,143,232,0.9)] hover:brightness-105"
          @click="handleClearError" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import Button from '~/volt/Button.vue'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed<number>((): number => {
  return Number(props.error?.statusCode) || 500
})

const is404 = computed<boolean>((): boolean => {
  return statusCode.value === 404
})

const titleText = computed<string>((): string => {
  if (is404.value) {
    return 'ไม่พบหน้าที่คุณต้องการ'
  }
  return 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
})

const descriptionText = computed<string>((): string => {
  if (is404.value) {
    return 'หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ Buddy Hub'
  }
  return 'ระบบกำลังปรับปรุงหรือมีปัญหาชั่วคราว กรุณาลองใหม่อีกครั้งในภายหลัง'
})

useSeoMeta({
  title: (): string => `${statusCode.value} - ${titleText.value}`,
  robots: 'noindex, nofollow, noarchive'
})

function handleClearError (): void {
  void clearError({ redirect: '/' })
}
</script>

<style scoped>
.landing-root {
  background: radial-gradient(circle at 12% 20%, #0f2a46 0%, transparent 42%),
    radial-gradient(circle at 88% 80%, #28184a 0%, transparent 40%),
    linear-gradient(145deg, #040b18 0%, #091827 45%, #060915 100%);
  isolation: isolate;
}

.ambient {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.ambient-cyan {
  background: radial-gradient(circle at 20% 30%, rgba(57, 198, 214, 0.26) 0%, transparent 38%);
  filter: blur(6px);
}

.ambient-indigo {
  background: radial-gradient(circle at 78% 70%, rgba(111, 143, 232, 0.3) 0%, transparent 40%);
  filter: blur(8px);
}

.ambient-vignette {
  background: radial-gradient(circle at center, transparent 55%, rgba(2, 6, 23, 0.55) 100%);
}
</style>
