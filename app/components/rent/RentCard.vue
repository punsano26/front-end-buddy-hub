<template>
  <Card
    pt:root:class="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <img
                :src="item.provider.profileImg ? imageBaseUrl + item.provider.profileImg : '/png/upload-profile.png'"
                alt="Profile Image"
                class="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm dark:border-slate-800">

              <span
                :class="[
                  'absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full dark:border-slate-900',
                  item.isOnline ? 'bg-emerald-400' : 'bg-slate-400'
                ]" />
            </div>

            <div class="flex flex-col leading-tight">
              <p class="font-semibold text-base text-slate-900 dark:text-white">
                {{ item.provider.nickname || item.provider.username }}
              </p>

              <p class="text-xs text-slate-500 dark:text-slate-400">
                <span>@{{ item.provider.username }}</span>
              </p>

              <div class="flex items-center gap-1 text-xs mt-1 text-slate-700 dark:text-slate-200">
                <i class="pi pi-star text-amber-400" />
                <span class="font-semibold">{{ item.provider.rating.averageRating !== null ? item.provider.rating.averageRating.toFixed(1) : '0.0' }}</span>
                <span class="text-slate-400">({{ item.provider.rating.reviewCount || 0 }})</span>
              </div>
            </div>
          </div>

          <Tag
            :value="item.category.name"
            class="text-[8px] sm:text-xs md:text-xs whitespace-nowrap shrink-0"
            icon="pi pi-face-smile"
            severity="success"
            rounded />
        </div>

        <p class="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
          {{ item.tagline }}
        </p>

        <div
          v-if="item.tags && item.tags.length"
          class="flex flex-wrap gap-2">
          <Tag
            v-for="(tag, index) in item.tags"
            :key="index"
            :value="tag"
            severity="secondary"
            rounded />
        </div>

        <div class="flex flex-wrap gap-2">
          <Tag
            v-if="item.provider.rating.averageRating && item.provider.rating.averageRating >= 4.5"
            icon="pi pi-star"
            severity="warn"
            value="Top Rated"
            rounded />
          <Tag
            icon="pi pi-check"
            severity="success"
            value="Certified Listener"
            rounded />
        </div>

        <Divider pt:root:class="p-horizontal:my-0 opacity-60 dark:opacity-30" />

        <div class="flex justify-between items-center">
          <div class="flex gap-4 text-sm">
            <p class="flex items-center gap-1 text-amber-500 font-semibold">
              <i class="pi pi-bitcoin" /> {{ item.coinRatePerMinute }} /นาที
            </p>

            <p class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <i class="pi pi-clock" /> สูงสุด {{ item.maxDurationMinutes }} นาที
            </p>
          </div>
          <div>
            <Button
              icon="pi pi-eye"
              pt:root:class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
              text
              @click="handleShowDetail(item.id)" />

            <Button
              icon="pi pi-send"
              label="เช่าคุย"
              pt:label:class="font-semibold"
              pt:root:class="bg-gradient-primary border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
              size="small"
              rounded
              @click="emit('rent')" />
          </div>
        </div>
      </div>
    </template>
  </Card>
  <RentPostDetailDialog
    v-model:visible="rentPostDetailVisible"
    :item="detailItem" />
</template>

<script lang="ts" setup>
import RentPostDetailDialog from '~/components/rent/RentPostDetailDialog.vue'
import type { TBaseParamsId } from '~/models/request/Request.model'
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'

const rentStore = useRentStore()
const { $handleLoading } = useNuxtApp()

const rentPostDetailVisible = ref(false)
const detailItem = ref<IFindAllRentPostList | null>(null)

defineProps<{
  item: IFindAllRentPostList
}>()

const emit = defineEmits<{
  (e: 'rent'): void
}>()

async function fetchPostDetail (id: TBaseParamsId): Promise<void> {
  await rentStore.fetchPostById(id)
  detailItem.value = rentStore.selectedPost
  rentPostDetailVisible.value = true
}

function handleShowDetail (id: TBaseParamsId): void {
  $handleLoading((): Promise<void> => fetchPostDetail(id))
}

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'
</script>

<style>
</style>
