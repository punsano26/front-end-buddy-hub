<template>
  <div class="flex flex-col gap-2 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
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
                <p class="text-lg font-extrabold tracking-tight text-surface-900 dark:text-white">{{ item?.category?.name }}</p>
                <Tag :value="isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'" :severity="isActive ? 'success' : 'danger'" />
              </div>
              <p class="text-sm text-surface-500 dark:text-surface-400">
                สร้างเมื่อ {{ item?.updatedAt ? dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm') : '' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 sm:justify-end">
            <i class="pi pi-pencil text-xl text-surface-500 hover:text-surface-900 cursor-pointer" />
            <span class="font-bold">{{ isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</span>
            <ToggleSwitch
              v-model="isActive"
              :pt:slider="isActive ? 'bg-green-700! dark:bg-green-600!' : 'bg-gray-400! dark:bg-gray-600!'"
              :pt:handle="isActive ? 'bg-white! dark:bg-slate-900!' : 'bg-white! dark:bg-slate-300!'" />
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
          v-model="tagline"
          :rules="formRules.tagline"
          :show-error="submitted"
          class="col-span-2"
          label="หัวข้อ"
          bold
          required />
        <InputLabelTextarea
          v-model="description"
          :rules="formRules.description"
          :show-error="submitted"
          class="col-span-2"
          label="รายละเอียด"
          bold
          required />
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 dark:text-slate-300">ความเชี่ยวชาญและเรื่องที่ถนัด (เลือกได้สูงสุด 5 เรื่อง) <span class="text-red-500">*</span></span>
            <Badge
              :severity="selectedExpertise.length > 0 ? 'success' : 'secondary'"
              :value="selectedExpertise.length + ' / 5'"
              class="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-gradient-to-r from-sky-400/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10" />
          </div>
          <div class="flex flex-wrap gap-2 pt-1.5">
            <button
              v-for="option in expertiseOptions"
              :key="option"
              :class="[
                'px-3.5 py-2 rounded-full border text-xs font-bold transition-all duration-300 flex items-center gap-1.5 active:scale-95',
                selectedExpertise.includes(option)
                  ? 'bg-gradient-primary border-transparent text-white shadow-md shadow-indigo-500/10 scale-[1.03] cursor-pointer'
                  : selectedExpertise.length >= 5
                    ? 'bg-slate-50 border-slate-100 text-slate-350 dark:bg-slate-900/30 dark:border-slate-900 dark:text-slate-650 cursor-not-allowed opacity-50'
                    : 'bg-slate-50/50 border-slate-200/80 text-slate-650 hover:border-indigo-500/30 hover:bg-slate-100 hover:text-indigo-600 dark:bg-slate-950 dark:border-slate-800/80 dark:text-slate-350 dark:hover:border-indigo-500/30 dark:hover:bg-slate-900 cursor-pointer shadow-2xs'
              ]"
              type="button"
              @click="toggleExpertise(option)">
              <i
                v-if="selectedExpertise.includes(option) && isOriginalTag(option)"
                class="pi pi-times text-[9px] text-white animate-scale-up" />
              {{ option }}
              <i
                v-if="!isOriginalTag(option)"
                :class="[
                  'pi pi-times-circle text-[12px] ml-1.5 transition-colors cursor-pointer hover:text-rose-200 active:scale-90',
                  selectedExpertise.includes(option) ? 'text-white/80' : 'text-slate-400 dark:text-slate-500 hover:text-rose-500'
                ]"
                @click.stop="removeCustomTag(option)" />
            </button>

            <!-- Inline Input for custom tag -->
            <div
              v-if="isAddingCustomTag"
              class="flex items-center">
              <input
                ref="customTagInputRef"
                v-model="customTagInput"
                class="px-3.5 py-1.5 rounded-full border border-indigo-500 text-xs font-bold focus:outline-hidden dark:bg-slate-950 dark:text-white max-w-[120px]"
                maxlength="20"
                placeholder="ระบุแท็ก..."
                type="text"
                @blur="submitCustomTag"
                @keydown.enter="submitCustomTag"
                @keydown.esc="cancelCustomTag" />
            </div>

            <!-- "+ เพิ่มแท็ก" Mini Button -->
            <button
              v-else
              :disabled="selectedExpertise.length >= 5"
              class="px-3.5 py-1.5 rounded-full border border-dashed border-indigo-500/60 text-indigo-600 hover:bg-indigo-500/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95 cursor-pointer dark:text-indigo-400 dark:border-indigo-500/40"
              type="button"
              @click="startAddingCustomTag">
              <i class="pi pi-plus text-[10px]" />
              เพิ่มแท็ก
            </button>
          </div>
          <p
            v-if="submitted && selectedExpertise.length === 0"
            class="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> โปรดเลือกอย่างน้อย 1 ความเชี่ยวชาญ
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
                  :model-value="price !== null ? String(price) : ''"
                  :rules="formRules.price"
                  :show-error="submitted"
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
                          : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/30 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
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
                  :model-value="String(responseTime)"
                  :rules="formRules.responseTime"
                  :show-error="submitted"
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
                        : 'bg-white border-slate-200 hover:border-slate-300 dark:bg-slate-900/30 dark:border-slate-800 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
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
        :disabled="!hasChanges"
        label="บันทึกการเปลี่ยนแปลง"
        icon="pi pi-save"
        pt:root:class="w-full sm:w-auto bg-gradient-primary border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
        @click="saveChanges" />
      <Button
        label="ลบโพสต์เช่าคุยนี้"
        icon="pi pi-trash"
        pt:root:class="w-full sm:w-auto bg-red-500 hover:bg-red-600! border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all px-5 sm:px-8 py-2.5 sm:py-3 rounded-2xl cursor-pointer"
        @click="deletePost" />
    </div>

    <ConfirmModalDialog
      v-model:visible="dialogOpenConfirmDeletePost"
      confirm-button="ใช่, ฉันต้องการลบโพสต์"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์เช่าคุยนี้?"
      title="ยืนยันการลบโพสต์"
      @confirm="confirmDeletePost" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'
import { validate, validateForm } from '~/plugins/Validate'
import RentProvider, { type IRentProvider } from '~/resource/provider/Rent.provider'
import { useRentStore } from '~/stores/Rent'
import Badge from '~/volt/Badge.vue'

definePageMeta({
  title: 'โพสต์เช่าคุยของฉัน',
  backPath: { name: 'public-rent' },
  backPlacement: 'page',
  middleware: [
    async (): Promise<any> => {
      if (import.meta.server) return

      const rentStore = useRentStore()
      try {
        const response = await rentStore.checkRentPostAlreadyExists()
        if (!response?.data?.hasPost) {
          return navigateTo('/public/rent/create')
        }
      } catch {
        return navigateTo('/public/rent/create')
      }
    }
  ]
})

const rentStore = useRentStore()
const rentService: IRentProvider = new RentProvider()
const { $handleLoading } = useNuxtApp()
const dayjs = useDayjs()
const toast = useToast()
const router = useRouter()

const customTagInputRef = ref<HTMLInputElement | null>(null)
const isAddingCustomTag = ref<boolean>(false)
const customTagInput = ref<string>('')
let isSubmitting = false

function startAddingCustomTag (): void {
  if (selectedExpertise.value.length >= 5) {
    toast.add({ severity: 'warn', summary: 'คำเตือน', detail: 'เลือกความเชี่ยวชาญได้ไม่เกิน 5 อย่าง', life: 3000 })
    return
  }
  isAddingCustomTag.value = true
  nextTick((): void => {
    customTagInputRef.value?.focus()
  })
}

async function submitCustomTag (): Promise<void> {
  if (isSubmitting) return
  isSubmitting = true
  try {
    const tagName = customTagInput.value.trim()
    if (!tagName) {
      cancelCustomTag()
      return
    }

    // Check if tag already exists in options
    const existingOption = expertiseOptions.value.find((opt: string): boolean => opt.toLowerCase() === tagName.toLowerCase())
    const finalTagName = existingOption || tagName

    // Check if already selected
    if (selectedExpertise.value.includes(finalTagName)) {
      toast.add({ severity: 'info', summary: 'ข้อมูล', detail: 'เลือกแท็กนี้อยู่แล้ว', life: 3000 })
      cancelCustomTag()
      return
    }

    // Check cap
    if (selectedExpertise.value.length >= 5) {
      toast.add({ severity: 'warn', summary: 'คำเตือน', detail: 'เลือกความเชี่ยวชาญได้ไม่เกิน 5 อย่าง', life: 3000 })
      cancelCustomTag()
      return
    }

    if (!expertiseOptions.value.includes(finalTagName)) {
      expertiseOptions.value.push(finalTagName)
    }

    selectedExpertise.value.push(finalTagName)

    toast.add({
      severity: 'success',
      summary: 'สำเร็จ',
      detail: 'เพิ่มแท็กใหม่สำเร็จ',
      life: 3000
    })

    cancelCustomTag()
  } finally {
    isSubmitting = false
  }
}

function cancelCustomTag (): void {
  isAddingCustomTag.value = false
  customTagInput.value = ''
}

function isOriginalTag (option: string): boolean {
  return originalTags.value.includes(option)
}

function removeCustomTag (option: string): void {
  const selIndex = selectedExpertise.value.indexOf(option)
  if (selIndex !== -1) {
    selectedExpertise.value.splice(selIndex, 1)
  }
  const optIndex = expertiseOptions.value.indexOf(option)
  if (optIndex !== -1) {
    expertiseOptions.value.splice(optIndex, 1)
  }
}

const originalTags = ref<string[]>([])
const expertiseOptions = ref<string[]>([])

const tagline = ref<string>('')
const description = ref<string>('')
const selectedExpertise = ref<string[]>([])
const price = ref<number | null>(4)
const responseTime = ref<number>(15)
const isActive = ref<boolean>(true)
const testDuration = ref<number>(30)
const item = ref<IFindAllRentPostList>()
const submitted = ref<boolean>(false)
const dialogOpenConfirmDeletePost = ref<boolean>(false)

const initialData = ref<{
  tagline: string
  description: string
  selectedExpertise: string[]
  price: number | null
  responseTime: number
  isActive: boolean
} | null>(null)

function arraysEqual (a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((val, index) => val === sortedB[index])
}

const hasChanges = computed((): boolean => {
  if (!initialData.value) return false
  return (
    tagline.value !== initialData.value.tagline ||
    description.value !== initialData.value.description ||
    price.value !== initialData.value.price ||
    responseTime.value !== initialData.value.responseTime ||
    isActive.value !== initialData.value.isActive ||
    !arraysEqual(selectedExpertise.value, initialData.value.selectedExpertise)
  )
})

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

const formRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  tagline: [validate.required],
  description: [validate.required],
  selectedExpertise: [
    (val: string[]): boolean | string => val.length > 0 || 'กรุณาเลือกความเชี่ยวชาญอย่างน้อย 1 อย่าง',
    (val: string[]): boolean | string => val.length <= 5 || 'เลือกความเชี่ยวชาญได้ไม่เกิน 5 อย่าง'
  ],
  price: [
    validate.required,
    (val: any): boolean | string => {
      const num = typeof val === 'string' ? Number(val) : val
      return (num !== null && !isNaN(num) && num >= 1) || 'กรุณากรอกค่าที่มากกว่าหรือเท่ากับ 1'
    },
    (val: any): boolean | string => {
      const num = typeof val === 'string' ? Number(val) : val
      return (num !== null && !isNaN(num) && num <= 100) || 'กรุณากรอกค่าที่น้อยกว่าหรือเท่ากับ 100'
    }
  ],
  responseTime: [
    validate.required,
    (val: any): boolean | string => {
      const num = typeof val === 'string' ? Number(val) : val
      return (num !== null && !isNaN(num) && num >= 1) || 'กรุณากรอกค่าที่มากกว่าหรือเท่ากับ 1'
    },
    (val: any): boolean | string => {
      const num = typeof val === 'string' ? Number(val) : val
      return (num !== null && !isNaN(num) && num <= 240) || 'กรุณากรอกค่าที่น้อยกว่าหรือเท่ากับ 240'
    }
  ]
}))

async function useFetch (): Promise<void> {
  await rentStore.fetchTags()
  originalTags.value = [...rentStore.tagNames]
  expertiseOptions.value = [...rentStore.tagNames]

  await rentStore.fetchMyPost()
  const detail = rentStore.myPost
  if (detail) {
    item.value = detail
    tagline.value = detail.tagline || ''
    description.value = detail.description || ''
    selectedExpertise.value = detail.tags || []
    price.value = detail.coinRatePerMinute
    responseTime.value = detail.maxDurationMinutes
    isActive.value = detail.isActive

    selectedExpertise.value.forEach((tag: string): void => {
      if (!expertiseOptions.value.includes(tag)) {
        expertiseOptions.value.push(tag)
      }
    })

    initialData.value = {
      tagline: tagline.value,
      description: description.value,
      selectedExpertise: [...selectedExpertise.value],
      price: price.value,
      responseTime: responseTime.value,
      isActive: isActive.value
    }
  }
}

function fetch (): void {
  $handleLoading(useFetch, {
    errorCallBack: (): void => {
      router.push({ name: 'public-rent-create' })
    }
  })
}

async function useUpdatePost (): Promise<void> {
  if (!item.value) return
  const payload = {
    categoryId: item.value.categoryId,
    tagline: tagline.value,
    description: description.value,
    coinRatePerMinute: price.value || 0,
    maxDurationMinutes: responseTime.value,
    isActive: isActive.value,
    tagNames: selectedExpertise.value
  }
  await rentStore.updatePost(item.value.id, payload)
  await useFetch()
}

function saveChanges (): void {
  submitted.value = true
  const formValues = {
    tagline: tagline.value,
    description: description.value,
    selectedExpertise: selectedExpertise.value,
    price: price.value,
    responseTime: responseTime.value
  }
  if (!validateForm(formValues, formRules.value)) {
    toast.add({ severity: 'error', summary: 'ผิดพลาด', detail: 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', life: 3000 })
    return
  }
  $handleLoading(useUpdatePost, {
    toast: {
      instance: toast,
      success: {
        detail: 'บันทึกการเปลี่ยนแปลงสำเร็จ'
      }
    }
  })
}

async function useDeletePost (): Promise<void> {
  if (!item.value) return
  await rentStore.deletePost(item.value.id)
  router.push({ name: 'public-rent' })
}

function deletePost (): void {
  dialogOpenConfirmDeletePost.value = true
}

function confirmDeletePost (): void {
  $handleLoading(useDeletePost, {
    toast: {
      instance: toast,
      success: {
        detail: 'ลบโพสต์เช่าคุยสำเร็จ'
      }
    }
  })
}

onMounted((): void => {
  fetch()
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
