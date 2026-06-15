<template>
  <div class="relative w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-8 flex flex-col gap-6 sm:gap-8 overflow-hidden min-h-[85vh]">
    <!-- Ultra-Premium ambient backdrop glow mesh -->
    <div class="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[800px] h-[350px] sm:h-[800px] bg-gradient-to-tr from-sky-500/8 via-violet-500/4 to-indigo-500/8 rounded-full blur-[70px] sm:blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
    <div class="absolute bottom-0 right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-br from-indigo-500/4 via-purple-500/2 to-sky-400/4 rounded-full blur-[60px] sm:blur-[110px] pointer-events-none -z-10" />

    <div class="relative z-10 w-full flex flex-col gap-6 sm:gap-8">
      <!-- SUCCESS STATE -->
      <Transition
        enter-active-class="transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)"
        enter-from-class="opacity-0 scale-90 translate-y-8"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90">
        <div
          v-if="isSubmitted"
          class="flex flex-col items-center justify-center min-h-[70vh] gap-6 sm:gap-8 py-4 sm:py-8 max-w-lg mx-auto w-full">
          
          <!-- Success Glowing Badge -->
          <div class="relative">
            <div class="absolute inset-0 bg-indigo-500/25 rounded-full blur-2xl animate-pulse" />
            <div class="absolute -inset-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full blur opacity-45 animate-spin-slow" />
            <div class="relative w-20 h-20 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_10px_35px_rgba(99,102,241,0.5)] animate-success-badge">
              <i class="pi pi-check text-4xl text-white animate-check-draw" />
            </div>
          </div>

          <!-- Success Message -->
          <div class="flex flex-col items-center gap-2 text-center px-4">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-50 tracking-tight">
              เปิดรับเช่าเพื่อนคุยสำเร็จ!
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-450 max-w-sm leading-relaxed">
              ระบบได้บันทึกข้อมูลบริการของคุณเรียบร้อยแล้ว รายการของคุณจะปรากฏในหน้าบริการทันที
            </p>
          </div>

          <!-- Ticket-Style Summary Card -->
          <div class="w-full bg-white/70 dark:bg-slate-900/85 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600" />
            
            <div class="flex flex-col gap-3.5">
              <div class="flex justify-between items-center text-xs sm:text-sm gap-2">
                <span class="text-slate-400 dark:text-slate-500 font-medium">ประเภทบริการ</span>
                <span class="font-extrabold text-slate-800 dark:text-slate-200 text-right bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-0.5 rounded-lg border border-indigo-100/30 dark:border-indigo-900/30">{{ submittedData?.service?.title }}</span>
              </div>
              <div class="h-px bg-slate-200/50 dark:bg-slate-800/50 border-dashed border-t" />
              <div class="flex justify-between items-start text-xs sm:text-sm gap-4">
                <span class="text-slate-400 dark:text-slate-500 font-medium shrink-0">สโลแกน</span>
                <span class="font-bold text-slate-700 dark:text-slate-300 text-right line-clamp-2 flex-1">{{ submittedData?.tagline }}</span>
              </div>
              <div class="h-px bg-slate-200/50 dark:bg-slate-800/50 border-dashed border-t" />
              <div class="flex justify-between items-start text-xs sm:text-sm gap-4">
                <span class="text-slate-400 dark:text-slate-500 font-medium shrink-0">แนะนำตัว</span>
                <span class="font-medium text-slate-600 dark:text-slate-400 text-right line-clamp-2 flex-1 leading-normal">{{ submittedData?.bio }}</span>
              </div>
              <div class="h-px bg-slate-200/50 dark:bg-slate-800/50 border-dashed border-t" />
              <div class="flex flex-col gap-2 text-xs sm:text-sm">
                <span class="text-slate-400 dark:text-slate-500 font-medium">ความเชี่ยวชาญ</span>
                <div class="flex flex-wrap gap-1.5 justify-end">
                  <span
                    v-for="exp in submittedData?.expertises"
                    :key="exp"
                    class="px-2.5 py-0.5 bg-gradient-to-r from-sky-400/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 dark:border-indigo-900/40 rounded-full text-[10px] sm:text-xs font-bold">
                    {{ exp }}
                  </span>
                </div>
              </div>
              <div class="h-px bg-slate-200/50 dark:bg-slate-800/50 border-dashed border-t" />
              <div class="flex justify-between items-center text-xs sm:text-sm gap-2">
                <span class="text-slate-400 dark:text-slate-500 font-medium shrink-0">เวลาตอบกลับเฉลี่ย</span>
                <span class="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 bg-sky-500/[0.05] dark:bg-sky-500/[0.02] px-2.5 py-0.5 rounded-lg border border-sky-500/10">
                  <i class="pi pi-clock text-sky-500 text-xs" />
                  ภายใน {{ submittedData?.responseTime }} นาที
                </span>
              </div>
              <div class="h-px bg-slate-200/50 dark:bg-slate-800/50 border-dashed border-t" />
              <div class="flex justify-between items-center text-xs sm:text-sm gap-2">
                <span class="text-slate-400 dark:text-slate-500 font-medium shrink-0">อัตราค่าบริการ</span>
                <span class="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-amber-500/[0.05] dark:bg-amber-500/[0.02] px-2.5 py-0.5 rounded-lg border border-amber-500/15">
                  <i class="pi pi-bitcoin text-amber-500 text-xs sm:text-sm animate-pulse" />
                  {{ submittedData?.price }} เหรียญ/นาที
                </span>
              </div>
            </div>
          </div>

          <Button
            label="กลับไปยังหน้าเช่าเพื่อนคุย"
            icon="pi pi-arrow-right"
            icon-pos="right"
            pt:root:class="bg-gradient-primary border-none shadow-[0_6px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:scale-[1.03] transition-all px-8 py-3.5 rounded-2xl cursor-pointer text-white font-extrabold text-sm flex items-center gap-2 group"
            @click="navigateToRent" />
        </div>
      </Transition>

      <!-- MAIN FORM STATE -->
      <div v-if="!isSubmitted" class="flex flex-col gap-6 sm:gap-8">
        <!-- Responsive Header Section matching premium index -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center">
            <ButtonBack
              :to="{ name: 'public-rent' }"
              icon="prime:chevron-left"
              label="ย้อนกลับ"
              class="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl sm:text-4xl font-black text-slate-800 dark:text-slate-50 tracking-tight flex items-center gap-2 flex-wrap">
                <span class="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  เปิดรับเช่าเพื่อนคุย
                </span>
                <span class="text-base sm:text-lg animate-bounce">💬</span>
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                สร้างรายได้เสริมในฐานะผู้รับฟังที่ดี ร่วมแชร์ประสบการณ์และส่งมอบพลังบวกให้กับผู้คน
              </p>
            </div>
            
            <!-- Beautiful Step indicator pill badge -->
            <div class="flex items-center self-start sm:self-auto shrink-0 mt-1 sm:mt-0">
              <div class="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 dark:from-sky-500/5 dark:to-indigo-500/5 border border-indigo-500/20 dark:border-indigo-500/10 rounded-full shadow-2xs">
                <i class="pi pi-list-check text-xs text-indigo-500 dark:text-indigo-400 animate-pulse" />
                <span class="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400">ขั้นตอนที่ {{ activeStep }} จาก 4</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Premium Glassmorphic Stepper Form Card -->
        <div class="w-full bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] transition-all duration-500">
          <StepperRent
            v-model="activeStep"
            :services="rentServices"
            @submit="onFormSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StepperRent from '~/components/rent/StepperRent.vue'
import RentProvider, { type IRentProvider } from '~/resource/provider/Rent.provider'
import Button from '~/volt/Button.vue'

definePageMeta({ layout: "navbar" });

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

const rentCategories = ref<any[]>([]);

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
    description: 'รับฟังและให้คำปรึกษาในเรื่องส่วนตัว เช่น ความเครียด ความสัมพันธ์ หรือปัญหาชีวิตต่างๆ โดยไม่ตัดสินและเป็นความลับ',
    note: 'ข้อมูลส่วนตัวจะถูกเก็บเป็นความลับและไม่ถูกเปิดเผย',
    noteIcon: 'pi pi-shield',
    icon: 'pi pi-heart'
  }
]

const rentService: IRentProvider = new RentProvider()
// async function getCategoriesRent (): Promise<void> {
//   const response = await rentService.findAllRentCategories();
//   rentCategories.value = response 
// }
</script>

<style>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.8;
    transform: translate(-50%, 0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -5px) scale(1.05);
  }
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes success-badge {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  70% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes check-draw {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 15s linear infinite;
}

.animate-success-badge {
  animation: success-badge 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-check-draw {
  animation: check-draw 0.4s 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
</style>