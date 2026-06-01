<template>
  <div
    class="flex flex-col gap-2 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 relative"
  >
    <!-- Subtle Background Accents -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-400/5 via-indigo-400/5 to-purple-400/5 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none" />

    <!-- SUCCESS STATE -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div
        v-if="isSubmitted"
        class="flex flex-col items-center justify-center min-h-[70vh] gap-6 sm:gap-8 relative z-10">
        <!-- Success Icon -->
        <div class="relative">
          <div class="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
          <div class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)] animate-success-pop">
            <i class="pi pi-check text-2xl sm:text-3xl text-white" />
          </div>
        </div>

        <!-- Success Message -->
        <div class="flex flex-col items-center gap-2 text-center max-w-md px-4">
          <h2 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            เปิดเช่าเพื่อนคุยสำเร็จ!
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            ระบบได้บันทึกข้อมูลบริการของคุณเรียบร้อยแล้ว รายการของคุณจะปรากฏในหน้าเช่าเพื่อนคุยทันที
          </p>
        </div>

        <!-- Summary Card -->
        <div class="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
          <div class="flex flex-col gap-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400 dark:text-slate-500">ประเภทบริการ</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ submittedData?.service?.title }}</span>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-800/50" />
            <div class="flex justify-between items-start text-sm gap-2">
              <span class="text-slate-400 dark:text-slate-500 shrink-0">สโลแกน</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300 text-right line-clamp-2 max-w-[200px] sm:max-w-[240px]">{{ submittedData?.tagline }}</span>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-800/50" />
            <div class="flex justify-between items-start text-sm gap-2">
              <span class="text-slate-400 dark:text-slate-500 shrink-0">แนะนำตัว</span>
              <span class="font-semibold text-slate-600 dark:text-slate-400 text-right line-clamp-2 max-w-[200px] sm:max-w-[240px]">{{ submittedData?.bio }}</span>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-800/50" />
            <div class="flex flex-col gap-2 text-sm">
              <span class="text-slate-400 dark:text-slate-500">ความเชี่ยวชาญ</span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="exp in submittedData?.expertises"
                  :key="exp"
                  class="px-2.5 py-1 bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-full text-xs font-semibold">
                  {{ exp }}
                </span>
              </div>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-800/50" />
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400 dark:text-slate-500">เวลาตอบกลับเฉลี่ย</span>
              <span class="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <i class="pi pi-clock text-indigo-500 dark:text-indigo-400 text-xs" />
                ภายใน {{ submittedData?.responseTime }} นาที
              </span>
            </div>
            <div class="h-px bg-slate-100 dark:bg-slate-800/50" />
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-400 dark:text-slate-500">อัตราค่าบริการ</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <i class="pi pi-bitcoin text-amber-500" />
                {{ submittedData?.price }} /นาที
              </span>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <Button
          label="กลับไปยังหน้าเช่าเพื่อนคุย"
          icon="pi pi-arrow-right"
          icon-pos="right"
          pt:root:class="bg-gradient-primary border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all px-6 sm:px-8 py-3 rounded-2xl cursor-pointer"
          @click="navigateToRent" />
      </div>
    </Transition>

    <!-- MAIN FORM STATE -->
    <div v-if="!isSubmitted" class="relative z-10">
      <!-- Header Section — matches index.vue / my-post.vue pattern -->
      <div class="flex items-center">
        <ButtonBack
          :to="{ name: 'public-rent' }"
          icon="prime:chevron-left"
          label="ย้อนกลับ" />
      </div>
      <h1 class="text-2xl font-bold sm:text-4xl">
        <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
          เปิดรับเช่าคุย
        </span>
      </h1>
      <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-6">
        <p class="text-sm sm:max-w-2xl text-slate-500 dark:text-slate-400">
          สร้างรายได้เสริมในฐานะผู้รับฟังที่ดี แชร์ประสบการณ์ชีวิตที่มีค่าของคุณ
        </p>
        <!-- Step indicator badge -->
        <div class="flex items-center gap-2 mt-2 sm:mt-0">
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-full">
            <i class="pi pi-list-check text-xs text-indigo-500 dark:text-indigo-400" />
            <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">ขั้นตอน {{ activeStep }} / 4</span>
          </div>
        </div>
      </div>

      <!-- Stepper Form Card -->
      <div class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-8 shadow-sm transition-all duration-300">
        <StepperRent
          v-model="activeStep"
          :services="rentServices"
          @submit="onFormSubmit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StepperRent from '~/components/rent/StepperRent.vue'
import Button from '~/volt/Button.vue'

// definePageMeta({ layout: "navbar" });

const activeStep = ref(1)
const isSubmitted = ref(false)
const submittedData = ref<any>(null)

const router = useRouter()
function navigateToRent (): void {
  router.push({ name: 'public-rent' })
}

function onFormSubmit (data: any): void {
  isSubmitted.value = true
  submittedData.value = data
}

const rentServices = [
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
    description: 'รับฟังและให้คำปรึกษาในเรื่องส่วนตัว เช่น ความเครียด ความสัมพันธ์ หรือปัญหาชีวิตต่างๆโดยไม่ตัดสินและเป็นความลับ',
    note: 'ข้อมูลส่วนตัวจะถูกเก็บเป็นความลับและไม่ถูกเปิดเผย',
    noteIcon: 'pi pi-info-circle',
    icon: 'pi pi-comments'
  }
]
</script>

<style>
@keyframes success-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-success-pop {
  animation: success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>