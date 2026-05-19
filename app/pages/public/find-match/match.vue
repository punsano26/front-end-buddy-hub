<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto w-full">
 

    <!-- Match Card -->
    <Card class="border border-surface-200 dark:border-surface-700 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-surface-900 transition-all hover:shadow-lg">
      <template #content>
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 p-2 md:p-4">
          
          <!-- User Info -->
          <div class="flex gap-4 items-center w-full md:w-auto">
            <div class="relative flex-shrink-0">
               <SecondaryButton size="large" icon="pi pi-user" aria-label="User Avatar" rounded class="!w-16 !h-16 flex items-center justify-center text-2xl shadow-sm bg-surface-100 dark:bg-surface-800" />
               <span class="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-surface-900 rounded-full"></span>
            </div>
            
            <div class="flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-lg font-semibold text-surface-900 dark:text-surface-0 m-0 leading-tight">
                  ผู้ใช้งานคนนี้คือเพื่อนใหม่ของคุณ
                </p>
                <Tag value="Private" severity="secondary" rounded class="text-xs px-2.5 py-1 font-medium bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300" />
              </div>
              <div class="flex flex-wrap items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <span class="flex items-center gap-1.5 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 px-2.5 py-1 rounded-full font-medium text-xs shadow-sm">
                  <i class="pi pi-venus text-xs"></i>
                  18y
                </span>
                <span class="hidden sm:inline text-surface-300 dark:text-surface-600">&bull;</span>
                <span class="text-xs sm:text-sm">ข้อมูลถูกซ่อนเพื่อความเป็นส่วนตัว</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-surface-100 dark:border-surface-800 pt-5 md:pt-0 mt-2 md:mt-0">
            <Button size="small" label="เพิ่มเพื่อน" icon="pi pi-user-plus" class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm" />
            <Button size="small" label="รายงาน" icon="pi pi-flag" severity="secondary" outlined class="flex-1 md:flex-none justify-center px-4 py-2 font-medium shadow-sm" />
            <Button size="small" text icon="pi pi-times" severity="secondary" class="hidden md:inline-flex !w-10 !h-10 p-0 items-center justify-center hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors" aria-label="Close" />
          </div>
        </div>
      </template>
    </Card>
    <!-- direct message chat room for send message -->
    <SpaceChat />
  </div>
</template>

<script lang="ts" setup>
import SpaceChat from '~/components/match/SpaceChat.vue'

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
</style>