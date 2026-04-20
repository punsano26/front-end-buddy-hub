<template>
  <Dialog
    v-model:visible="visible"
    :closable="true"
    :modal="true"
    :style="{ width: '400px' }"
    header="รายงานผู้ใช้">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <p class="text-md font-medium">
          คุณต้องการรายงานผู้ใช้นี้หรือไม่?
        </p>
        <p class="text-sm text-gray-500">
          โปรดระบุเหตุผลในการรายงานผู้ใช้เพื่อให้เราสามารถดำเนินการได้อย่างเหมาะสม
        </p>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="selectedReasons"
            input-id="ingredient1"
            value="threat" />
          <label for="ingredient1"> ⚠️ คุกคาม / ทำให้รู้สึกไม่ปลอดภัย </label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="selectedReasons"
            input-id="ingredient2"
            value="abusive_language" />
          <label for="ingredient2"> 💬 คำพูดไม่เหมาะสม </label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="selectedReasons"
            input-id="ingredient3"
            value="advertising" />
          <label for="ingredient3"> 📢 โฆษณา / ขายของ </label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="selectedReasons"
            input-id="ingredient4"
            value="spam_bot" />
          <label for="ingredient4"> 🚫 สแปมรัวๆ เหมือนบอท </label>
        </div>
        <InputLabelTextarea
          placeholder="ระบุเหตุผลของคุณที่นี่..."
          rows="3"
          auto-resize />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          label="ยกเลิก"
          pt:root:class="bg-red-500 enabled:hover:bg-red-600 text-white border-none"
          @click="visible = false" />
        <Button
          :disabled="selectedReasons.length === 0"
          label="ส่งรายงาน"


          @click="handleReport" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const visible = defineModel<boolean>('visible', { default: false })
const { $handleLoading } = useNuxtApp()
const selectedReasons = ref<string[]>([])

const reportAction = (): Promise<void> => {
  return new Promise((resolve: () => void): void => {
    setTimeout((): void => {
      visible.value = false
      selectedReasons.value = []
      resolve()
    }, 100)
  })
}

function handleReport (): void {
  $handleLoading(reportAction, {
    toast: {
      instance: toast,
      success: {
        summary: 'รายงานสาเร็จ',
        detail: 'ขอบคุณที่ช่วยทำให้ชุมชนของเราปลอดภัยยิ่งขึ้น!'
      }
    }
  })
}
</script>

<style>

</style>
