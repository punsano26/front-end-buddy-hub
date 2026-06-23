<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-120"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden border-none rounded-3xl bg-white dark:bg-slate-900 shadow-2xl"
    dismissable-mask
    modal>
    <!-- Success Celebration Header Section -->
    <div class="bg-gradient-to-br from-emerald-400 to-teal-600 p-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
      <!-- Ambient Glow decoration -->
      <div class="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-emerald-300/20 blur-2xl pointer-events-none" />

      <!-- Success Tick Icon -->
      <div
        class="w-16 h-16 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center text-emerald-500 shadow-lg mb-4 transform scale-110 animate-bounce"
        style="animation-duration: 2s">
        <i class="pi pi-check-circle text-3xl font-bold" />
      </div>

      <h3 class="text-2xl font-extrabold text-white tracking-tight">
        ส่งคำขอเช่าคุยสำเร็จ!
      </h3>
      <p class="text-xs text-emerald-50/80 mt-1">
        ระบบได้ทำการหักเหรียญและส่งคำขอไปยังเพื่อนคุยเรียบร้อยแล้ว
      </p>
    </div>

    <!-- Details Section -->
    <div class="p-6 flex flex-col gap-5">
      <!-- Companion Quick Detail Card -->
      <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <img
          :src="item?.provider?.profileImg ? imageBaseUrl + item.provider.profileImg : '/png/upload-profile.png'"
          alt="Profile Image"
          class="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
        <div class="flex-1 min-w-0">
          <p class="font-bold text-slate-800 dark:text-slate-100 truncate">
            {{ item?.provider?.nickname || item?.provider?.username }}
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-550">
            {{ item?.category?.name || 'เพื่อนคุย' }}
          </p>
          <div class="flex items-center gap-1.5 mt-1.5">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <span class="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              รออนุมัติจากผู้ให้บริการ
            </span>
          </div>
        </div>
      </div>

      <!-- Cost & Duration Summary Grid -->
      <div class="grid grid-cols-2 gap-3.5">
        <div class="bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-2xl text-center border border-slate-100 dark:border-slate-800/50">
          <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            ระยะเวลาที่เลือก
          </p>
          <p class="text-lg font-extrabold text-slate-700 dark:text-slate-200 mt-1">
            {{ durationMinutes }} นาที
          </p>
        </div>
        <div class="bg-slate-50/70 dark:bg-slate-800/30 p-3.5 rounded-2xl text-center border border-slate-100 dark:border-slate-800/50">
          <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            ค่าบริการที่หัก
          </p>
          <p class="text-lg font-extrabold text-amber-500 mt-1 flex items-center justify-center gap-1">
            <i class="pi pi-coin text-amber-500" />
            {{ coinCost }} เหรียญ
          </p>
        </div>
      </div>

      <!-- Information Alert Notice -->
      <div class="bg-sky-50/50 dark:bg-sky-950/10 p-4 rounded-2xl border border-sky-100/50 dark:border-sky-900/20 text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
        <div class="flex gap-2.5 items-start">
          <i class="pi pi-info-circle text-sky-500 text-sm shrink-0 mt-0.5" />
          <div>
            <p class="font-bold text-sky-700 dark:text-sky-400 mb-0.5">
              ขั้นตอนถัดไป
            </p>
            <p>กรุณารอผู้ให้บริการตอบรับคำขอสนทนา คุณสามารถกด <span class="font-bold text-slate-800 dark:text-slate-100">"เปิดหน้าแชท"</span> เพื่อรอสถานะหรือฝากข้อความไว้ได้ล่วงหน้า หากผู้รับฟังปฏิเสธระบบจะคืนเหรียญให้โดยอัตโนมัติค่ะ</p>
          </div>
        </div>
      </div>

      <!-- Action Footer buttons -->
      <div class="flex gap-3 justify-end mt-2">
        <Button
          label="กลับหน้าหลัก"
          pt:root:class="!px-4 !py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all duration-200 active:scale-95 text-xs sm:text-sm bg-transparent"
          @click="visible = false" />
        <Button
          icon="pi pi-comments"
          label="เปิดหน้าแชท"
          pt:label:class="font-semibold text-xs sm:text-sm text-white"
          pt:root:class="bg-gradient-primary border-none !px-5 !py-2 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 rounded-xl"
          @click="handleGoToChat" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { IFindAllRentPostList } from '~/models/response/RentRes.model'
import Button from '~/volt/Button.vue'
import Dialog from '~/volt/Dialog.vue'

const imageBaseUrl = import.meta.env.VITE_ENV_BASE_FILE_URL + '/'
const visible = defineModel<boolean>('visible', { default: false })

defineProps<{
  item: IFindAllRentPostList | null
  durationMinutes: number
  coinCost: number
}>()

const emit = defineEmits<{
  (e: 'chat'): void
}>()

const handleGoToChat = (): void => {
  emit('chat')
  visible.value = false
}
</script>

<style scoped>
</style>
