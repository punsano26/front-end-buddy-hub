<template>
  <Dialog
    v-model:visible="visible"
    :closable="true"
    :modal="true"
    pt:content:class="!p-6"
    pt:header:class="hidden"
    pt:root:class="max-w-md w-full mx-4 rounded-3xl overflow-hidden">
    <div class="flex flex-col items-center text-center gap-4">
      <div class="w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 animate-pulse">
        <i class="pi pi-envelope text-3xl" />
      </div>
      <div class="flex flex-col gap-1.5">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
          กรุณายืนยันอีเมลก่อนสร้างโพสต์
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          ระบบต้องการให้คุณยืนยันอีเมลก่อนเปิดรับเช่าเพื่อนคุย หากยังไม่ได้รับอีเมลยืนยัน สามารถกดปุ่มด้านล่างเพื่อส่งใหม่อีกครั้งได้ทันที
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-center gap-2 w-full mt-2">
        <Button
          label="ปิด"
          pt:root:class="w-full sm:w-1/2 rounded-xl text-xs font-semibold py-2.5 cursor-pointer"
          severity="secondary"
          text
          @click="visible = false" />
        <Button
          :loading="loading"
          icon="pi pi-send"
          label="ส่งอีเมลยืนยัน"
          pt:root:class="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-600 border-none text-white rounded-xl text-xs font-bold py-2.5 shadow-sm cursor-pointer"
          @click="$emit('send')" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Button from '~/volt/Button.vue'
import Dialog from '~/volt/Dialog.vue'

const visible = defineModel<boolean>('visible', { default: false })

withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false
})

defineEmits<{
  send: []
}>()
</script>
