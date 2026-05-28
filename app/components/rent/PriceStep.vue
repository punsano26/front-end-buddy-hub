<template>
  <div class="p-4 sm:p-6 flex flex-col gap-6">
    <div class="text-center px-2">
      <h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
        <i class="pi pi-wallet text-emerald-500 text-base sm:text-lg animate-pulse" />
        ตั้งค่าอัตราค่าบริการและเวลาตอบกลับ
      </h2>
      <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
        กำหนดเรตราคาที่สมเหตุสมผลตามความเชี่ยวชาญของคุณ เพื่อเพิ่มโอกาสในการได้รับการจ้างงาน
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left Column: Config Panel -->
      <div class="lg:col-span-7 flex flex-col gap-6">
        <!-- Rate Config Card -->
        <div class="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col gap-5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <i class="pi pi-bitcoin text-amber-500 text-sm" />
              1. อัตราค่าบริการต่อนาที
            </span>
            <span
              :class="[
                'text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-300',
                priceTier.style
              ]">
              {{ priceTier.label }}
            </span>
          </div>

          <!-- Main Input Field -->
          <div class="w-full">
            <InputLabelField
              label=""
              required>
              <div class="relative flex items-center">
                <InputNumber
                  v-model="price"
                  :max="100"
                  :min="1"
                  class="w-full"
                  placeholder="เช่น 10" />
                <span class="absolute right-12 text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none">
                  เหรียญ / นาที
                </span>
              </div>
            </InputLabelField>
          </div>

          <!-- Quick Presets -->
          <div class="flex flex-col gap-2">
            <span class="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">เลือกเรตด่วนแนะนำ:</span>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="preset in getRecommendedPresets()"
                :key="preset"
                :class="[
                  'px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105',
                  price === preset
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
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
        <div class="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col gap-5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <i class="pi pi-clock text-indigo-500 text-sm" />
              2. เวลาตอบกลับเฉลี่ย
            </span>
            <span class="text-[9px] sm:text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              ตอบกลับเร็วมีโอกาสสูงกว่า
            </span>
          </div>

          <!-- Main Input Field -->
          <div class="w-full">
            <InputLabelField
              label=""
              required>
              <div class="relative flex items-center">
                <InputNumber
                  v-model="responseTime"
                  :max="240"
                  :min="1"
                  class="w-full"
                  placeholder="เช่น 15" />
                <span class="absolute right-12 text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none">
                  นาที
                </span>
              </div>
            </InputLabelField>
          </div>

          <!-- Quick Presets for Response Time -->
          <div class="flex flex-col gap-2">
            <span class="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">เลือกช่วงเวลาตอบด่วน:</span>
            <div class="flex gap-1.5 sm:gap-2 flex-wrap">
              <button
                v-for="rt in [5, 15, 30, 60]"
                :key="rt"
                :class="[
                  'px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all duration-200 cursor-pointer hover:scale-105',
                  responseTime === rt
                    ? 'bg-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
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
        <div class="h-full flex flex-col justify-between bg-gradient-to-br from-emerald-500/[0.08] via-indigo-500/[0.03] to-purple-500/[0.08] border border-emerald-500/20 rounded-3xl p-4 sm:p-6 shadow-sm gap-6">
          <div class="flex flex-col gap-5">
            <div class="flex items-center justify-between border-b border-emerald-500/10 pb-3">
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <i class="pi pi-calculator text-emerald-500 text-xs sm:text-sm animate-pulse" />
                เครื่องมือจำลองรายได้
              </span>
              <span class="text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <!-- Simulation Settings -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">จำลองระยะเวลาสนทนา:</span>
                <span class="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">{{ testDuration }} นาที</span>
              </div>

              <!-- Slider HTML5 standard with nice design -->
              <div class="w-full flex items-center gap-2">
                <input
                  v-model.number="testDuration"
                  class="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                  max="180"
                  min="5"
                  step="5"
                  type="range">
              </div>

              <!-- Quick picks for duration -->
              <div class="grid grid-cols-4 gap-1.5">
                <button
                  v-for="dur in [15, 30, 60, 120]"
                  :key="dur"
                  :class="[
                    'text-[10px] font-bold py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer hover:scale-105',
                    testDuration === dur
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900/60 dark:border-slate-800/40 text-slate-500 dark:text-slate-400'
                  ]"
                  type="button"
                  @click="testDuration = dur">
                  {{ dur }} น.
                </button>
              </div>
            </div>

            <!-- Live Results -->
            <div class="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3.5 backdrop-blur-xs">
              <div class="flex justify-between items-center text-[11px] sm:text-xs">
                <span class="text-slate-500 dark:text-slate-400">เรตราคาต่อนาที:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ price || 0 }} เหรียญ / นาที</span>
              </div>
              <div class="h-px bg-slate-200/40 dark:bg-slate-800/40" />

              <!-- Total coins display -->
              <div class="flex flex-col items-center justify-center py-2.5 gap-1 bg-gradient-to-r from-amber-500/[0.03] to-amber-500/[0.08] dark:from-amber-400/[0.01] dark:to-amber-400/[0.05] rounded-xl border border-amber-500/10">
                <div class="flex items-center gap-1.5">
                  <i class="pi pi-bitcoin text-lg sm:text-xl text-amber-500 animate-bounce" />
                  <span class="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {{ testDuration * (price || 0) }}
                  </span>
                  <span class="text-[11px] sm:text-xs font-semibold text-slate-500">เหรียญ</span>
                </div>
                <span class="text-[9px] text-slate-400 dark:text-slate-500">เหรียญรวมจากการคุย {{ testDuration }} นาที</span>
              </div>

              <div class="h-px bg-slate-200/40 dark:bg-slate-800/40" />

              <!-- Earnings in THB -->
              <div class="flex justify-between items-center gap-2">
                <span class="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">รายได้เข้ากระเป๋าจริง (บาท):</span>
                <span class="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ฿{{ Math.floor(testDuration * (price || 0) * 0.9) }}
                </span>
              </div>
              <p class="text-[9px] text-slate-400 dark:text-slate-500 leading-normal text-right">
                * หักค่าธรรมเนียมแพลตฟอร์ม 10% ({{ Math.ceil(testDuration * (price || 0) * 0.1) }} เหรียญ)
              </p>
            </div>
          </div>

          <!-- Recommendation advice text -->
          <div class="p-3 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-2xl text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2 items-start mt-auto">
            <span class="text-emerald-500 text-xs sm:text-sm">💡</span>
            <div>
              <span class="font-bold text-slate-700 dark:text-slate-300">คำแนะนำ: </span>
              {{ priceAdvice }}
            </div>
          </div>
        </div>
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
        :disabled="!price || price <= 0 || !responseTime || responseTime <= 0"
        icon="pi pi-arrow-right"
        icon-pos="right"
        label="ขั้นตอนถัดไป"
        pt:root:class="!rounded-xl"
        @click="price && price > 0 && responseTime && responseTime > 0 && $emit('next')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InputLabelField from '~/components/input/InputLabelField.vue'
import Button from '~/volt/Button.vue'
import Divider from '~/volt/Divider.vue'
import InputNumber from '~/volt/InputNumber.vue'

const price = defineModel<number | null>('price', { default: 4 })
const responseTime = defineModel<number>('responseTime', { default: 15 })

const props = defineProps<{
  selectedServiceId: string | null
}>()

defineEmits<{
  next: []
  prev: []
}>()

const testDuration = ref<number>(30)

function getRecommendedPresets (): number[] {
  if (props.selectedServiceId === 'casual-friend') {
    return [4, 6, 8, 10]
  } else if (props.selectedServiceId === 'emotional-support') {
    return [12, 15, 18, 21]
  }
  return [4, 8, 12, 16, 21]
}

const priceTier = computed((): { label: string, style: string } => {
  const p = price.value || 0
  if (p === 0) return { label: 'ยังไม่ได้ระบุ', style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
  if (p <= 6) return { label: 'ประหยัดเริ่มต้น', style: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' }
  if (p <= 11) return { label: 'คุ้มค่าระดับมาตรฐาน', style: 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 border-teal-200 dark:border-teal-900/50' }
  if (p <= 17) return { label: 'ที่ปรึกษายอดนิยม', style: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50' }
  if (p <= 25) return { label: 'ผู้เชี่ยวชาญพิเศษ', style: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' }
  return { label: 'พรีเมียม / วีไอพี', style: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 animate-pulse' }
})

const priceAdvice = computed((): string => {
  const p = price.value || 0
  const isCasual = props.selectedServiceId === 'casual-friend'
  const isEmotional = props.selectedServiceId === 'emotional-support'

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
