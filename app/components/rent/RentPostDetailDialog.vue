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
          :src="item?.provider.profileImg ? imageBaseUrl + item.provider.profileImg : '/png/upload-profile.png'"
          alt="Profile Image"
          class="w-24 h-24 rounded-full border-4 border-[#0c1612] bg-slate-800 object-cover shadow-lg">
        <span
          :class="[
            'absolute bottom-1 right-1 w-4.5 h-4.5 border-3 border-[#13231c] rounded-full',
            item?.provider.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
          ]" />
      </div>

      <!-- Info Details -->
      <div class="flex-1 flex flex-col gap-1">
        <h3 class="text-2xl font-bold text-white leading-tight">
          {{ item?.provider.nickname || item?.provider.username }}
        </h3>
        <p class="text-sm text-primary-950 leading-normal flex items-center gap-2">
          @{{ item?.provider.username }}
        </p>
        <div class="flex flex-wrap gap-2">
          <Tag
            :value="item?.category.name || 'ไม่ระบุหมวดหมู่'"
            class="text-xs font-medium dark:text-primary-950 dark:bg-primary-500 dark:border-primary-500"
            icon="pi pi-heart"
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
              <Tag
                :value="item?.tagline || 'ไม่มีคำโปรย'"
                class="text-xs font-medium"
                severity="info"
                rounded />
            </h4>
            <p
              v-if="item?.description"
              class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ item?.description }}
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
                {{ item?.coinRatePerMinute }} เหรียญ
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
                {{ item?.maxDurationMinutes }} นาที
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
                {{ item?.provider.rating.reviewCount }} ครั้ง
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
                  {{ item?.provider.rating.averageRating !== null && item?.provider.rating.averageRating !== undefined ? item.provider.rating.averageRating.toFixed(1) : '0.0' }} / 5
                </p>
                <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  {{ item?.provider.rating.reviewCount }} รีวิว
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- All tags list -->
        <div v-if="item?.tags && item.tags.length">
          <h5 class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            แท็กทั้งหมด
          </h5>
          <div class="flex flex-wrap gap-1.5">
            <Tag
              v-for="(tag, index) in item.tags"
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
          pt:root:class="!px-4 !py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm bg-transparent"
          @click="visible = false" />
        <Button
          icon="pi pi-send"
          label="เริ่มเช่าคุย"
          pt:label:class="font-semibold text-xs sm:text-sm text-white"
          pt:root:class="bg-gradient-primary border-none !px-5 !py-2 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 rounded-xl"
          @click="handleRent" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'
import Button from '~/volt/Button.vue'
import Card from '~/volt/Card.vue'
import Dialog from '~/volt/Dialog.vue'
import Tag from '~/volt/Tag.vue'

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'
const visible = defineModel<boolean>('visible', { default: false })

defineProps<{
  item?: IFindAllRentPostList | null
}>()

const emit = defineEmits<{
  (e: 'rent'): void
}>()

const handleRent = (): void => {
  emit('rent')
  visible.value = false
}
</script>

<style>
</style>
