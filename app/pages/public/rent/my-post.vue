<template>
  <div class="flex flex-col gap-2 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10" >
    <div class="flex items-center">
      <ButtonBack
        :to="{ name: 'public-rent' }"
        icon="prime:chevron-left"
        label="ย้อนกลับ" />
    </div>
    <h1 class="text-2xl font-bold sm:text-4xl">
      <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
        โพสต์เช่าคุยของฉัน
      </span>
    </h1>
    <p>จัดการโปรไฟล์และเรตของคุณ</p>

    <Card>
      <template #content>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center p-4 rounded-2xl bg-gradient-primary shadow-[0_10px_30px_rgba(120,120,255,0.3)]">
              <i class="pi pi-asterisk text-xl text-white" />
            </div>
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <p class="text-lg font-extrabold tracking-tight text-surface-900 dark:text-white">เพื่อนคุยทั่วไป</p>
                <Tag value="เปิดใช้งาน" severity="success" />
              </div>
              <p class="text-sm text-surface-500 dark:text-surface-400">
                สร้างเมื่อ 1/6/2569
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 sm:justify-end">
            <i class="pi pi-pencil text-xl text-surface-500 hover:text-surface-900 cursor-pointer" />
            <span class="font-bold">เปิดใช้งาน</span>
            <ToggleSwitch pt:slider="bg-green-700!" />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="flex items-center gap-4">
          <i class="pi pi-hashtag text-xl text-surface-500 hover:text-surface-900 cursor-pointer" />
          <p>โพสต์เช่าคุยของคุณได้รับความน่าเชื่อถือ</p>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
          <p class="font-bold">โปรไฟล์</p>
           <InputLabelField
              class="col-span-2"
              label="หัวข้อ"
              bold
              required />
              <InputLabelTextarea
              class="col-span-2"
              label="รายละเอียด"
              bold
              required />
              <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                  <p class="font-bold">ความเชี่ยวชาญ<span class="text-red-500">*</span><span>(สูงสุด 5)</span></p>
                  <Badge
                    :value="selectedExpertise.length + '/5'"
                    severity="secondary" />
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in expertiseOptions"
                    :key="option"
                    :class="[
                      'px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200',
                      selectedExpertise.includes(option)
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm scale-105 cursor-pointer dark:bg-emerald-400 dark:border-emerald-400 dark:text-slate-900'
                        : selectedExpertise.length >= 5
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-700 cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-200'
                    ]"
                    type="button"
                    @click="toggleExpertise(option)">
                    {{ option }}
                  </button>
                </div>
                <p
                  v-if="selectedExpertise.length === 0"
                  class="text-[10px] text-red-500">
                  * โปรดเลือกอย่างน้อย 1 ความเชี่ยวชาญ
                </p>
              </div>
        </template>
    </Card>

    <Card>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <p class="font-bold">เรตและการตอบกลับ</p>
            <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/40">
              แนะนำตามตลาด
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-7 flex flex-col gap-4">
              <div class="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <i class="pi pi-bitcoin text-amber-500 text-sm" />
                    เรตต่อนาที
                  </span>
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    :class="priceTier.style">
                    {{ priceTier.label }}
                  </span>
                </div>
                <InputLabelField
                  label="เรตต่อนาที (เหรียญ)"
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

                <div class="flex flex-col gap-2">
                  <span class="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400">เรตแนะนำด่วน:</span>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      v-for="preset in [4, 6, 8, 10, 12]"
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

              <div class="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <i class="pi pi-clock text-indigo-500 text-sm" />
                    เวลาตอบกลับ
                  </span>
                  <span class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                    ตอบไวมีโอกาสสูงกว่า
                  </span>
                </div>
                <InputLabelField
                  label="เวลาตอบกลับ (นาที)"
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

            <div class="lg:col-span-5">
              <div class="h-full flex flex-col justify-between bg-gradient-to-br from-emerald-500/[0.08] via-indigo-500/[0.03] to-purple-500/[0.08] border border-emerald-500/20 rounded-2xl p-4 shadow-sm gap-4">
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <i class="pi pi-calculator text-emerald-500 text-xs animate-pulse" />
                      ตัวอย่างรายได้เฉลี่ย
                    </span>
                    <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-semibold text-slate-600 dark:text-slate-400">จำลองเวลา:</span>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ testDuration }} นาที</span>
                  </div>
                  <input
                    v-model.number="testDuration"
                    class="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                    max="180"
                    min="5"
                    step="5"
                    type="range">

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

                  <div class="bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-3 flex flex-col gap-3">
                    <div class="flex justify-between items-center text-[11px]">
                      <span class="text-slate-500 dark:text-slate-400">เรตต่อนาที:</span>
                      <span class="font-semibold text-slate-800 dark:text-slate-200">{{ price || 0 }} เหรียญ</span>
                    </div>
                    <div class="h-px bg-slate-200/40 dark:bg-slate-800/40" />
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">รายได้เฉลี่ย:</span>
                      <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ฿{{ Math.floor(testDuration * (price || 0) * 0.9) }}
                      </span>
                    </div>
                    <p class="text-[9px] text-slate-400 dark:text-slate-500 text-right">
                      * หักค่าธรรมเนียมแพลตฟอร์ม 10%
                    </p>
                  </div>
                </div>

                <div class="p-3 bg-emerald-500/[0.06] border border-emerald-500/10 rounded-xl text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed flex gap-2 items-start">
                  <span class="text-emerald-500 text-xs">💡</span>
                  <div>
                    <span class="font-bold text-slate-700 dark:text-slate-300">คำแนะนำ: </span>
                    {{ priceAdvice }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
      <Button
        disabled
        label="บันทึกการเปลี่ยนแปลง"
        icon="pi pi-save"
        pt:root:class="w-full sm:w-auto bg-gradient-primary border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl cursor-pointer" />
      <Button
        label="ลบโพสต์เช่าคุยนี้"
        icon="pi pi-trash"
        pt:root:class="w-full sm:w-auto bg-red-500 hover:bg-red-600! border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl cursor-pointer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Badge from '~/volt/Badge.vue'

definePageMeta({
  title: 'โพสต์เช่าคุยของฉัน',
  backPath: { name: 'public-rent' },
  backPlacement: 'page'
});
const expertiseOptions = ref([
  'เกม', 'ดูหนัง', 'เพลง', 'ท่องเที่ยว', 'อาหาร', 
  'กาแฟ', 'กีฬา', 'ฟิตเนส', 'แฟชั่น', 'ความงาม', 
  'ช้อปปิ้ง', 'อนิเมะ', 'การ์ตูน'
]);

const selectedExpertise = ref<string[]>(['เกม', 'ดูหนัง', 'ท่องเที่ยว', 'อนิเมะ', 'การ์ตูน']);

const price = ref<number | null>(4)
const responseTime = ref<number>(15)
const testDuration = ref<number>(30)

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
  if (p === 0) return 'โปรดระบุเรตราคาต่อนาทีที่คุณต้องการเปิดรับสาย'
  if (p < 4) return 'เรตค่อนข้างต่ำ แนะนำให้ตั้งไว้ที่อย่างน้อย 4 เหรียญ'
  if (p > 18) return 'เรตค่อนข้างสูง เหมาะสำหรับผู้ที่มีรีวิวหรือประสบการณ์สูง'
  return 'เรตนี้กำลังดี เข้าถึงง่ายและมีโอกาสได้รับสายแรกเร็วขึ้น'
})

function toggleExpertise (option: string): void {
  const index = selectedExpertise.value.indexOf(option)
  if (index !== -1) {
    selectedExpertise.value.splice(index, 1)
  } else if (selectedExpertise.value.length < 5) {
    selectedExpertise.value.push(option)
  }
}

</script>

<style></style>
