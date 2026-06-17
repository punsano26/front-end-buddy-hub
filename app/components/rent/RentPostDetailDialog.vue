<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-130"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden border-none rounded-2xl bg-white dark:bg-slate-900 shadow-xl"
    dismissable-mask
    modal>
    <!-- Dark Header Section matching the screenshot -->
    <div class="bg-gradient-primary p-6 relative flex items-center gap-4 text-white">
      <!-- Avatar with status indicator -->
      <div class="relative flex-shrink-0">
        <img
          :src="displayData.profileImg"
          alt="Profile Image"
          class="w-24 h-24 rounded-full border-4 border-[#0c1612] bg-slate-800 object-cover shadow-lg">
        <span
          :class="[
            'absolute bottom-1 right-1 w-4.5 h-4.5 border-3 border-[#13231c] rounded-full',
            displayData.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
          ]" />
      </div>

      <!-- Info Details -->
      <div class="flex-1 flex flex-col gap-1">
        <h3 class="text-2xl font-bold text-white leading-tight">
          {{ displayData.nickname }}
        </h3>
        <p class="text-sm text-slate-400 leading-normal flex items-center gap-1.5">
          @{{ displayData.username }}
          <span
            v-if="displayData.age"
            class="text-slate-500">·</span>
          <span v-if="displayData.age">{{ displayData.age }}</span>
        </p>
        <div class="flex flex-wrap gap-2">
          <Tag
            class="text-xs font-medium"
            icon="pi pi-heart"
            value="เพื่อนคุยทั่วไป"
            rounded />
        </div>
      </div>

      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
        @click="visible = false">
        <i class="pi pi-times text-lg" />
      </button>
    </div>

    <!-- Main Content Container -->
    <div class="flex flex-col gap-4 mt-4">
      <!-- Details & Stats Container -->
      <div class="px-6 flex flex-col gap-4">
        <!-- Tagline & Description Card -->
        <Card
          pt:body:class="p-4 gap-0"
          pt:root:class="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-none">
          <template #content>
            <h4 class="text-base font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2 mb-2 leading-snug">
              <span class="text-lg">🤍</span> {{ displayData.tagline }}
            </h4>
            <p
              v-if="displayData.description"
              class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ displayData.description }}
            </p>
          </template>
        </Card>

        <!-- Stats Grid -->
        <div class="grid grid-cols-3 gap-4">
          <!-- Rate Per Minute -->
          <Card
            pt:body:class="p-3.5 gap-0"
            pt:root:class="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl text-center shadow-none transition-all duration-300 hover:shadow-xs">
            <template #content>
              <div class="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-2">
                <i class="pi pi-bitcoin text-amber-500 text-sm" />
              </div>
              <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                เรต/นาที
              </p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {{ displayData.coinRatePerMinute }} เหรียญ
              </p>
            </template>
          </Card>

          <!-- Max Duration -->
          <Card
            pt:body:class="p-3.5 gap-0"
            pt:root:class="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl text-center shadow-none transition-all duration-300 hover:shadow-xs">
            <template #content>
              <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mx-auto mb-2">
                <i class="pi pi-clock text-blue-500 text-sm" />
              </div>
              <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                นานสูงสุด
              </p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {{ displayData.maxDurationMinutes }} นาที
              </p>
            </template>
          </Card>

          <!-- Sessions count -->
          <Card
            pt:body:class="p-3.5 gap-0"
            pt:root:class="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl text-center shadow-none transition-all duration-300 hover:shadow-xs">
            <template #content>
              <div class="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center mx-auto mb-2">
                <i class="pi pi-wave-pulse text-indigo-500 text-sm" />
              </div>
              <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                เซสชัน
              </p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                {{ displayData.sessionCount }} ครั้ง
              </p>
            </template>
          </Card>
        </div>

        <!-- Rating & Reviews -->
        <Card
          pt:body:class="px-4 py-3"
          pt:root:class="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl shadow-none">
          <template #content>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                  <i class="pi pi-star-fill text-amber-500 text-xs" />
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    รีวิวและการตอบรับ
                  </p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    จากผู้ใช้งานจริงในระบบ
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {{ displayData.rating.averageRating.toFixed(1) }} / 5.0
                </p>
                <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  {{ displayData.rating.reviewCount }} รีวิว
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- All tags list -->
        <div v-if="displayData.tags && displayData.tags.length">
          <h5 class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            แท็กทั้งหมด
          </h5>
          <div class="flex flex-wrap gap-1.5">
            <Tag
              v-for="(tag, index) in displayData.tags"
              :key="index"
              :value="tag"
              pt:root:class="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50" />
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="border-t border-slate-100 dark:border-slate-800/80 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 flex gap-3 justify-end rounded-b-2xl mt-4">
        <Button
          label="ปิดหน้าต่าง"
          pt:root:class="!px-4 !py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm bg-transparent"
          @click="visible = false" />
        <Button
          icon="pi pi-phone"
          label="เริ่มเช่าคุย"
          pt:label:class="font-semibold text-xs sm:text-sm text-white"
          pt:root:class="bg-gradient-primary border-none !px-5 !py-2 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 rounded-xl"
          @click="handleRent" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { IFindAllRentPostList, IFindAllRentTagsData } from '~/models/response/RentRes.model'
import Button from '~/volt/Button.vue'
import Card from '~/volt/Card.vue'
import Dialog from '~/volt/Dialog.vue'
import Tag from '~/volt/Tag.vue'

interface DisplayData {
  nickname: string
  username: string
  age: string
  profileImg: string
  tagline: string
  description: string
  coinRatePerMinute: number
  maxDurationMinutes: number
  sessionCount: number
  tags: string[]
  rating: {
    averageRating: number
    reviewCount: number
  }
  isOnline: boolean
}

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'

const props = defineProps<{
  item?: IFindAllRentPostList | null
}>()

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  (e: 'rent'): void
}>()

// Fallback mockup data matching current values in the file
const mockData = {
  provider: {
    nickname: 'John Doe',
    username: 'caseywright',
    age: '27 ปี',
    profileImg: '/png/upload-profile.png',
    rating: {
      averageRating: 4.9,
      reviewCount: 120
    }
  },
  tagline: 'พื้นที่ปลอดภัยสำหรับระบายความรู้สึก รับฟังโดยไม่ตัดสิน 🤍',
  description: 'ยินดีรับฟังทุกเรื่องโดยไม่ตัดสิน พร้อมแชร์ประสบการณ์และค้นหาทางออกไปพร้อมกัน 💚',
  coinRatePerMinute: 2,
  maxDurationMinutes: 90,
  sessionCount: 858,
  tags: ['เพื่อนคุยทั่วไป', 'เปิดรับจ้าง', 'รับฟังปัญหาทางใจ', 'ปรึกษาเรื่องงาน']
}


const displayData = computed((): DisplayData => {
  if (props.item) {
    const item = props.item
    return {
      nickname: item.provider.nickname || item.provider.username,
      username: item.provider.username,
      age: (item.provider as any).age ? `${(item.provider as any).age} ปี` : '',
      profileImg: item.provider.profileImg ? `${imageBaseUrl}${item.provider.profileImg}` : '/png/upload-profile.png',
      tagline: item.tagline,
      description: item.description || '',
      coinRatePerMinute: item.coinRatePerMinute,
      maxDurationMinutes: item.maxDurationMinutes,
      sessionCount: 858, // default placeholder sessions
      tags: item.tags?.map((t: IFindAllRentTagsData): string => t.name) || [],
      rating: {
        averageRating: item.provider.rating.averageRating !== null ? item.provider.rating.averageRating : 0,
        reviewCount: item.provider.rating.reviewCount || 0
      },
      isOnline: item.isOnline
    }
  }

  return {
    nickname: mockData.provider.nickname,
    username: mockData.provider.username,
    age: mockData.provider.age,
    profileImg: mockData.provider.profileImg,
    tagline: mockData.tagline,
    description: mockData.description,
    coinRatePerMinute: mockData.coinRatePerMinute,
    maxDurationMinutes: mockData.maxDurationMinutes,
    sessionCount: mockData.sessionCount,
    tags: mockData.tags,
    rating: {
      averageRating: mockData.provider.rating.averageRating,
      reviewCount: mockData.provider.rating.reviewCount
    },
    isOnline: true
  }
})

const handleRent = (): void => {
  emit('rent')
  visible.value = false
}
</script>

<style>
</style>
