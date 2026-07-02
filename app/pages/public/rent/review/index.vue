<template>
  <div class="relative w-full max-w-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col gap-6 overflow-hidden min-h-[85vh]">
    <!-- Ambient background glows -->
    <div class="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-tr from-sky-500/8 via-violet-500/4 to-indigo-500/8 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none -z-10" />
    <div class="absolute bottom-0 right-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-gradient-to-br from-indigo-500/4 via-purple-500/2 to-sky-400/4 rounded-full blur-[50px] sm:blur-[100px] pointer-events-none -z-10" />

    <!-- Back Button -->
    <div class="flex items-center">
      <ButtonBack
        :to="backRoute"
        icon="prime:chevron-left"
        label="ย้อนกลับ"
        class="hover:scale-[1.02] transition-transform duration-200" />
    </div>

    <!-- Main Review Card -->
    <Card class="relative overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl backdrop-blur-md bg-white/80 dark:bg-slate-900/90 rounded-3xl">
      <template #content>
        <!-- Loading state -->
        <div v-if="loadingData" class="flex flex-col items-center justify-center py-16 gap-3">
          <i class="pi pi-spin pi-spinner text-3xl text-indigo-500" />
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">กำลังโหลดข้อมูลคู่สนทนา...</span>
        </div>

        <div v-else class="flex flex-col gap-6 py-2 px-1">
          <!-- Header and User details -->
          <div class="flex flex-col items-center text-center gap-3">
            <div class="relative">
              <!-- Glow ring behind avatar -->
              <div class="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full blur opacity-40 animate-pulse" />
              <!-- Avatar -->
              <Avatar
                :image="getProfileImg(targetUser?.profileImg)"
                size="xlarge"
                shape="circle"
                class="w-20 h-20 border-2 border-white dark:border-slate-850 shadow-md relative z-10" />
            </div>
            
            <div class="flex flex-col gap-1 mt-1">
              <h1 class="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                ให้คะแนนกับ คุณ{{ targetUser?.nickname || targetUser?.username || 'คู่สนทนา' }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                การสนทนาของคุณสิ้นสุดลงแล้ว ร่วมรีวิวและให้คะแนนเพื่อช่วยปรับปรุงบริการของเรา
              </p>
            </div>
          </div>

          <Divider class="my-1" />

          <!-- Rating Star Selector -->
          <div class="flex flex-col items-center gap-3">
            <span class="text-sm font-bold text-slate-700 dark:text-slate-300">ระดับความพึงพอใจ</span>
            <div class="flex items-center gap-3">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @mouseenter="hoveredRating = star"
                @mouseleave="hoveredRating = 0"
                @click="setRating(star)"
                class="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full p-1 transition-all duration-200 active:scale-90 hover:scale-125 transform"
                :class="[
                  star <= (hoveredRating || formValues.rating) 
                    ? 'text-amber-400 dark:text-amber-300' 
                    : 'text-slate-300 dark:text-slate-700 hover:text-slate-400'
                ]">
                <i 
                  :class="[
                    star <= (hoveredRating || formValues.rating) ? 'pi pi-star-fill animate-bounce' : 'pi pi-star',
                    'text-3xl sm:text-4xl'
                  ]" 
                  :style="star <= (hoveredRating || formValues.rating) ? 'animation-duration: 0.5s' : ''" />
              </button>
            </div>
            
            <!-- Rating descriptive text -->
            <span 
              v-if="ratingLabel"
              class="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15 animate-fade-in">
              {{ ratingLabel }}
            </span>
            <span v-else class="text-xs text-slate-400 dark:text-slate-500">
              แตะดาวเพื่อเลือกคะแนนความพึงพอใจ
            </span>

            <p v-if="ratingErrorMessage" class="text-xs text-red-500 font-medium">
              {{ ratingErrorMessage }}
            </p>
          </div>

          <!-- Quick review tags -->
          <div class="flex flex-col gap-2">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-400">แท็กด่วน (แตะเพื่อเพิ่มในรีวิว)</span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in quickTags"
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                class="text-xs px-3 py-1.5 rounded-xl transition-all duration-250 border cursor-pointer select-none font-medium flex items-center gap-1.5 active:scale-95"
                :class="[
                  selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-white border-transparent shadow-xs scale-102 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                ]">
                <i v-if="selectedTags.includes(tag)" class="pi pi-check text-[10px]" />
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Comment input -->
          <div class="flex flex-col gap-1.5">
            <InputLabelTextarea
              v-model="formValues.review"
              label="รายละเอียดความคิดเห็น"
              placeholder="กรุณาเล่าความรู้สึกหรือสิ่งที่ประทับใจจากการคุยครั้งนี้..."
              :rules="formRules.review"
              :show-error="showErrors"
              required />
            <div class="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 px-1 mt-0.5">
              <span>เขียนอย่างน้อย 10 ตัวอักษร</span>
              <span :class="{ 'text-red-500 font-semibold': formValues.review.length > 200 }">
                {{ formValues.review.length }}/200 ตัวอักษร
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col gap-3 mt-2">
            <Button
              @click="submitReview"
              icon="pi pi-send"
              label="ส่งความคิดเห็นและให้คะแนน"
              pt:root:class="bg-gradient-primary border-none shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_22px_rgba(99,102,241,0.4)] hover:scale-[1.01] transition-all py-3 rounded-2xl cursor-pointer text-white font-extrabold text-sm flex items-center justify-center gap-2" />
            
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { validate } from '~/plugins/Validate'
import RentCustomerProvider from '~/resource/provider/RentCustomer.provider'
import RentProvider from '~/resource/provider/Rent.provider'
import UserProvider from '~/resource/provider/User.provider'
import type { ICreateAReviewPayload } from '~/models/request/RentReq.model'
import type { ICreateAReviewResponse } from '~/models/response/RentRes.model'
import { useAuthStore } from '~/stores/Auth'

definePageMeta({
  layout: 'navbar',
  title: 'รีวิวและให้คะแนน'
})

interface ITargetUser {
  id: number
  username: string
  nickname: string | null
  profileImg: string | null
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const rentCustomerService = new RentCustomerProvider()
const rentService = new RentProvider()
const userService = new UserProvider()
const imageBaseUrl = (import.meta.env.VITE_ENV_BASE_FILE_URL || '') + '/'

const sessionId = computed((): number | null => route.query.sessionId ? Number(route.query.sessionId) : null)
const partnerId = computed((): number | null => route.query.partnerId ? Number(route.query.partnerId) : null)

const targetUser = ref<ITargetUser | null>(null)
const loadingData = ref(false)
const hoveredRating = ref(0)
const selectedTags = ref<string[]>([])
const showErrors = ref(false)

const quickTags = [
  'สุภาพน่ารัก',
  'พูดคุยสนุก',
  'ให้คำปรึกษาดี',
  'ตอบกลับเร็วมาก',
  'เป็นกันเองสุดๆ',
  'ตรงต่อเวลา'
]

const formValues = ref({
  rating: 0,
  review: ''
})

const formRules = ref({
  rating: [
    (v: number): boolean | string => v > 0 || 'กรุณาเลือกคะแนนอย่างน้อย 1 ดาว'
  ],
  review: [
    (v: string): boolean | string => validate.required(v),
    (v: string): boolean | string => validate.minLength(v, 10),
    (v: string): boolean | string => validate.maxLength(v, 200)
  ]
})

const ratingErrorMessage = computed((): string => {
  if (!showErrors.value) return ''
  for (const rule of formRules.value.rating) {
    const res = rule(formValues.value.rating)
    if (res !== true) return res as string
  }
  return ''
})

const reviewErrorMessage = computed((): string => {
  if (!showErrors.value) return ''
  for (const rule of formRules.value.review) {
    const res = rule(formValues.value.review)
    if (res !== true) return res as string
  }
  return ''
})

const ratingLabel = computed((): string => {
  const score = hoveredRating.value || formValues.value.rating
  switch (score) {
    case 5:
      return 'ยอดเยี่ยมที่สุด!'
    case 4:
      return 'ดีมาก'
    case 3:
      return 'ปานกลาง'
    case 2:
      return 'พอใช้'
    case 1:
      return 'ควรปรับปรุง'
    default:
      return ''
  }
})

const backRoute = computed((): any => {
  if (sessionId.value) {
    return { name: 'public-rent-chat-id', params: { id: sessionId.value } }
  }
  return { name: 'public-rent-chat' }
})

function getProfileImg (imgUrl: string | null | undefined): string {
  if (imgUrl) {
    if (imgUrl.startsWith('http')) return imgUrl
    return imageBaseUrl + imgUrl
  }
  return '/png/upload-profile.png'
}

function setRating (star: number): void {
  formValues.value.rating = star
}

function toggleTag (tag: string): void {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
    const prefix = formValues.value.review.trim() ? formValues.value.review.trim() + ' ' : ''
    formValues.value.review = `${prefix}#${tag}`
  } else {
    selectedTags.value.splice(index, 1)
    formValues.value.review = formValues.value.review
      .replace(new RegExp(`\\s*#${tag}`, 'g'), '')
      .trim()
  }
}

async function fetchTargetDetails (): Promise<void> {
  loadingData.value = true
  try {
    if (sessionId.value) {
      const response = await rentCustomerService.findOneConversationSessionById(sessionId.value)
      if (response?.data) {
        const session = response.data
        const isProvider = authStore.user.id === session.customerId
        const partner = isProvider ? session.provider : session.customer
        if (partner) {
          targetUser.value = {
            id: partner.id,
            username: partner.username,
            nickname: partner.nickname,
            profileImg: partner.profileImg
          }
        }
      }
    } else if (partnerId.value) {
      const response = await userService.findOneUserById(partnerId.value)
      if (response?.data) {
        targetUser.value = {
          id: response.data.id,
          username: response.data.username,
          nickname: response.data.nickname,
          profileImg: response.data.profileImg
        }
      }
    }
  } catch (error) {
    console.error('Failed to load review target details:', error)
  } finally {
    loadingData.value = false
  }
}

const { $handleLoading } = useNuxtApp()

async function onSubmit (): Promise<void> {
  showErrors.value = true
  if (ratingErrorMessage.value || reviewErrorMessage.value) {
    toast.add({
      severity: 'error',
      summary: 'เกิดข้อผิดพลาด',
      detail: 'กรุณากรอกข้อมูลรีวิวให้ครบถ้วนและถูกต้อง',
      life: 3000
    })
    return
  }

  if (!sessionId.value || !targetUser.value?.id) {
    toast.add({
      severity: 'error',
      summary: 'เกิดข้อผิดพลาด',
      detail: 'ข้อมูลไม่ครบถ้วน ไม่สามารถส่งรีวิวได้',
      life: 3000
    })
    return
  }

  const payload: ICreateAReviewPayload = {
    hireSessionId: sessionId.value,
    reviewedUserId: targetUser.value.id,
    rating: formValues.value.rating,
    comment: formValues.value.review
  }

  const response = await $handleLoading(
    (): Promise<ICreateAReviewResponse> => rentService.createAReview(payload),
    {
      toast: {
        instance: toast,
        success: {
          detail: 'ส่งความคิดเห็นเรียบร้อยแล้ว ขอบคุณสำหรับการรีวิวค่ะ!'
        }
      }
    }
  )

  if (response) {
    await router.push(backRoute.value)
  }
}

function submitReview (): void {
  void onSubmit()
}

function skipReview (): void {
  void router.push(backRoute.value)
}

onMounted((): void => {
  void fetchTargetDetails()
})
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
</style>