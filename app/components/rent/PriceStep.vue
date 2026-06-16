<template>
  <div class="p-3 sm:p-6 flex flex-col gap-6">
    <div class="text-center px-2">
      <h2 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center justify-center gap-2">
        <i class="pi pi-wallet text-indigo-500 animate-pulse text-base sm:text-lg" />
        ตั้งค่าบริการและเวลาตอบกลับ
      </h2>
      <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-lg mx-auto leading-relaxed">
        กำหนดเรตราคาที่สะท้อนความเชี่ยวชาญของคุณ เพื่อเพิ่มโอกาสสูงสุดในการตอบรับสายลูกค้า
      </p>
    </div>

    <!-- Configuration Grid (Splits beautifully on Desktop, stacks on iPhone) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left Column: Config Panel -->
      <div class="lg:col-span-7 flex flex-col gap-6">
        <!-- Rate Config Card -->
        <div class="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xs relative overflow-hidden group">
          <div class="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-slate-150 dark:border-slate-800">
            <span class="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <i class="pi pi-bitcoin text-amber-500 text-sm sm:text-base animate-pulse" />
              1. อัตราค่าบริการต่อนาที
            </span>
            <span
              :class="[
                'text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300',
                priceTier.style
              ]">
              {{ priceTier.label }}
            </span>
          </div>

          <!-- Main Input Field -->
          <div class="w-full pt-1">
            <InputLabelField
              label=""
              required>
              <div class="relative flex items-center w-full group">
                <InputNumber
                  v-model="price"
                  :max="100"
                  :min="1"
                  class="w-full !rounded-xl transition-all duration-300 border-slate-200/80 dark:border-slate-850 hover:border-indigo-500/30 focus:border-indigo-500"
                  placeholder="เช่น 10" />
                <span class="absolute right-4 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                  เหรียญ / นาที
                </span>
              </div>
            </InputLabelField>
          </div>

          <!-- Quick Presets -->
          <div class="flex flex-col gap-2.5">
            <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">เลือกเรตแนะนำ:</span>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="preset in getRecommendedPresets()"
                :key="preset"
                :class="[
                  'px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black border transition-all duration-300 cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95',
                  price === preset
                    ? 'bg-gradient-primary border-transparent text-white shadow-md shadow-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-350 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-350 shadow-2xs'
                ]"
                type="button"
                @click="price = preset">
                <i
                  :class="price === preset ? 'text-white' : 'text-amber-500'"
                  class="pi pi-bitcoin text-[10px]" />
                {{ preset }}
              </button>
            </div>
          </div>
        </div>

        <!-- Response Time Card -->
        <div class="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-2xs relative overflow-hidden group">
          <div class="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-slate-150 dark:border-slate-800">
            <span class="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <i class="pi pi-clock text-indigo-500 text-sm sm:text-base animate-spin-slow" />
              2. เวลาตอบกลับเฉลี่ย
            </span>
            <span class="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/[0.08] dark:bg-indigo-950/30 border border-indigo-500/20 shadow-2xs">
              ตอบกลับไวช่วยสร้างความมั่นใจ
            </span>
          </div>

          <!-- Main Input Field -->
          <div class="w-full pt-1">
            <InputLabelField
              label=""
              required>
              <div class="relative flex items-center w-full group">
                <InputNumber
                  v-model="responseTime"
                  :max="60"
                  :min="1"
                  class="w-full rounded-xl! transition-all duration-300 border-slate-200/80 dark:border-slate-850 hover:border-indigo-500/30 focus:border-indigo-500"
                  placeholder="เช่น 15" />
                <span class="absolute right-4 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 pointer-events-none">
                  นาที
                </span>
              </div>
            </InputLabelField>
          </div>

          <!-- Quick Presets for Response Time -->
          <div class="flex flex-col gap-2.5">
            <span class="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">เลือกช่วงเวลาด่วน:</span>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="rt in [5, 15, 30, 60]"
                :key="rt"
                :class="[
                  'px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black border transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-2xs',
                  responseTime === rt
                    ? 'bg-gradient-primary border-transparent text-white shadow-md shadow-indigo-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-350 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-350'
                ]"
                type="button"
                @click="responseTime = rt">
                {{ rt === 5 ? 'ด่วนจี๋ (5 น.)' : rt === 15 ? 'ด่วน (15 น.)' : rt === 30 ? 'ปกติ (30 น.)' : 'สบายๆ (60 น.)' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Premium Earnings Simulator -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="h-full flex flex-col justify-between bg-gradient-to-br from-sky-500/[0.04] via-indigo-500/[0.02] to-purple-500/[0.04] dark:from-sky-500/[0.02] dark:to-purple-500/[0.02] border border-indigo-500/20 dark:border-indigo-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-inner gap-5 sm:gap-6 relative overflow-hidden">
          <div class="flex flex-col gap-4 sm:gap-5">
            <div class="flex items-center justify-between border-b border-indigo-500/10 pb-3">
              <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <i class="pi pi-calculator text-indigo-500 text-xs sm:text-sm animate-pulse" />
                เครื่องจำลองรายได้
              </span>
              <span class="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 dark:from-sky-500/5 dark:to-indigo-500/5 px-2.5 py-0.5 rounded-full border border-indigo-500/10">
                Live Preview
              </span>
            </div>

            <!-- Simulation Slider Settings -->
            <div class="flex flex-col gap-3.5">
              <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span class="text-slate-500 dark:text-slate-400">จำลองระยะเวลาสนทนา:</span>
                <span class="text-sm font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-500/10">{{ testDuration }} นาที</span>
              </div>

              <!-- Sleek Slider styling -->
              <div class="w-full flex items-center gap-2 py-1.5">
                <input
                  v-model.number="testDuration"
                  class="w-full accent-indigo-600 h-2 bg-slate-200/80 dark:bg-slate-800 rounded-lg cursor-pointer transition-all focus:outline-none"
                  max="180"
                  min="5"
                  step="5"
                  type="range">
              </div>

              <!-- Quick duration buttons -->
              <div class="grid grid-cols-4 gap-1.5">
                <button
                  v-for="dur in [15, 30, 60, 120]"
                  :key="dur"
                  :class="[
                    'text-[10px] font-black py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs',
                    testDuration === dur
                      ? 'bg-gradient-primary border-transparent text-white shadow-sm'
                      : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-950 dark:border-slate-900 text-slate-500 dark:text-slate-400'
                  ]"
                  type="button"
                  @click="testDuration = dur">
                  {{ dur }} น.
                </button>
              </div>
            </div>

            <!-- Live Calculation Results -->
            <div class="bg-white/60 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-850 rounded-2xl p-4 flex flex-col gap-3.5 backdrop-blur-md shadow-3xs">
              <div class="flex justify-between items-center text-xs font-semibold">
                <span class="text-slate-500 dark:text-slate-400">เรตตั้งค่าบริการ:</span>
                <span class="font-extrabold text-slate-800 dark:text-slate-200">{{ price || 0 }} เหรียญ / นาที</span>
              </div>
              <div class="h-px bg-slate-200/40 dark:bg-slate-800/40" />

              <!-- Total coins indicator -->
              <div class="flex flex-col items-center justify-center py-4 gap-1 bg-gradient-to-r from-amber-500/[0.02] to-amber-500/[0.08] dark:from-amber-400/[0.01] dark:to-amber-400/[0.04] rounded-xl border border-amber-500/10">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-bitcoin text-xl text-amber-500 animate-bounce" />
                  <span class="text-2xl sm:text-3xl font-black text-slate-850 dark:text-slate-50 tracking-tight transition-all duration-300">
                    {{ testDuration * (price || 0) }}
                  </span>
                  <span class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase">เหรียญ</span>
                </div>
                <span class="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">รายได้รวมจากการสนทนา {{ testDuration }} นาที</span>
              </div>

              <div class="h-px bg-slate-200/40 dark:bg-slate-800/40" />

              <!-- THB conversion output -->
              <div class="flex justify-between items-center gap-2">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">รายได้เข้ากระเป๋าจริง (ประมาณ):</span>
                <span class="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                  ฿{{ Math.floor(testDuration * (price || 0) * 0.9) }}
                </span>
              </div>
              <p class="text-[9px] text-slate-400 dark:text-slate-550 leading-normal text-right font-medium">
                * หักค่าธรรมเนียมแพลตฟอร์ม 10% ({{ Math.ceil(testDuration * (price || 0) * 0.1) }} เหรียญ)
              </p>
            </div>
          </div>

          <!-- Price advice popup Notice -->
          <div class="p-3 bg-indigo-500/[0.06] border border-indigo-500/10 rounded-xl text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2 items-start mt-auto">
            <span class="text-indigo-500 text-xs sm:text-sm shrink-0">💡</span>
            <div>
              <span class="font-black text-slate-700 dark:text-slate-300">คำแนะนำ: </span>
              {{ priceAdvice }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <Divider class="!my-2 border-slate-200/50 dark:border-slate-800/60" />

    <!-- Actions Block -->
    <div class="flex items-center justify-between gap-3 pt-2">
      <Button
        class="text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer rounded-xl px-4 py-2"
        icon="pi pi-arrow-left"
        label="ย้อนกลับ"
        severity="secondary"
        text
        @click="$emit('prev')" />
      <Button
        :disabled="!price || price <= 0 || !responseTime || responseTime <= 0"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl px-5 py-2.5 bg-gradient-primary border-none text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm font-extrabold cursor-pointer"
        @click="price && price > 0 && responseTime && responseTime > 0 && $emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import InputLabelField from '~/components/input/InputLabelField.vue'
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'
import InputNumber from '~/volt/InputNumber.vue'

const price = defineModel<number | null>('price', { default: 4 })
const responseTime = defineModel<number>('responseTime', { default: 15 })

interface RentServiceOption {
  id: string
  title: string
  priceLabel: string
  description: string
  icon?: string
  note?: string
  noteIcon?: string
}

const props = defineProps<{
  selectedService: RentServiceOption | null
}>()

defineEmits<{
  next: []
  prev: []
}>()

const testDuration = ref<number>(30)

function getRecommendedPresets (): number[] {
  if (!props.selectedService) return [4, 8, 12, 16, 21]

  const title = props.selectedService.title
  if (title.includes('ที่ปรึกษา') || title.toLowerCase().includes('emotional')) {
    return [12, 15, 18, 21]
  }
  return [4, 6, 8, 10]
}

const priceTier = computed((): { label: string, style: string } => {
  const p = price.value || 0
  if (p === 0) return { label: 'ยังไม่ได้ระบุ', style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
  if (p <= 6) return { label: 'ประหยัดเริ่มต้น', style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
  if (p <= 11) return { label: 'คุ้มค่าระดับมาตรฐาน', style: 'bg-teal-500/10 text-teal-650 dark:text-teal-400 border-teal-500/20' }
  if (p <= 17) return { label: 'ที่ปรึกษายอดนิยม', style: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' }
  if (p <= 25) return { label: 'ผู้เชี่ยวชาญพิเศษ', style: 'bg-purple-500/10 text-purple-650 dark:text-purple-400 border-purple-500/20' }
  return { label: 'พรีเมียม / วีไอพี', style: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse' }
})

const priceAdvice = computed((): string => {
  const p = price.value || 0
  if (!props.selectedService) {
    return 'เลือกตั้งราคาที่สอดคล้องกับหัวข้อเรื่องที่ถนัด ยิ่งเรตเข้าถึงง่ายยิ่งเพิ่มโอกาสได้รับสายแรกเร็วขึ้น!'
  }

  const title = props.selectedService.title
  const isEmotional = title.includes('ที่ปรึกษา') || title.toLowerCase().includes('emotional')
  const isCasual = !isEmotional

  if (p === 0) {
    return 'โปรดระบุเรตราคาต่อนาทีที่คุณต้องการเปิดรับสาย'
  }

  if (isCasual) {
    if (p < 4) return 'เรตค่อนข้างต่ำ แนะนำให้ตั้งไว้ที่อย่างน้อย 4 เหรียญ เพื่อให้คุ้มกับเวลาของคุณ'
    if (p > 10) return 'บริการเพื่อนคุยทั่วไป เรตแนะนำคือ 4-10 เหรียญ หากต้องการตั้งราคานี้ แนะนำอัปเกรดเป็น ที่ปรึกษาทางใจ เพื่อความน่าเชื่อถือ'
    return 'ยอดเยี่ยม! เรตราคานี้เหมาะสมมากสำหรับบริการเพื่อนคุยทั่วไป ดึงดูดลูกค้าได้ดีเยี่ยม'
  }

  if (isEmotional) {
    if (p < 12) return 'เรตต่ำกว่ามาตรฐานสำหรับบริการปรึกษาทางใจ แนะนำเริ่มที่ 12 เหรียญ เพื่อสะท้อนถึงคุณภาพการรับฟังเชิงลึก'
    if (p > 21) return 'เรตค่อนข้างสูง เหมาะสำหรับผู้ที่มีใบรับรอง ประสบการณ์สูง หรือรีวิวระดับ 5 ดาวเท่านั้นในช่วงแรก'
    return 'เรตราคานี้เหมาะสมมากกับงานรับฟังและซัพพอร์ตอารมณ์ คุ้มค่าและสะท้อนคุณภาพที่ดี'
  }

  return 'เลือกตั้งราคาที่สอดคล้องกับหัวข้อเรื่องที่ถนัด ยิ่งเรตเข้าถึงง่ายยิ่งเพิ่มโอกาสได้รับสายแรกเร็วขึ้น!'
})
</script>
