<template>
  <Dialog
    v-model:visible="banStore.isBannedModalVisible"
    :closable="false"
    :modal="true"
    :style="{ width: '440px', maxWidth: '90vw' }"
    header="บัญชีถูกระงับการใช้งาน">
    <div class="flex flex-col items-center gap-4 py-2 text-center">
      <div class="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500">
        <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2" />
        </svg>
      </div>

      <div class="flex flex-col gap-2 w-full">
        <h3 class="text-xl font-bold text-red-600 dark:text-red-400">
          บัญชีของคุณถูกระงับการใช้งาน
        </h3>
        <p class="text-sm text-surface-600 dark:text-surface-300">
          ผู้ดูแลระบบได้ระงับการใช้งานบัญชีของคุณ เนื่องจากละเมิดข้อกำหนดการใช้งาน
        </p>
      </div>

      <div class="w-full p-4 rounded-xl bg-surface-100 dark:bg-surface-800 flex flex-col gap-3 text-left text-sm">
        <div>
          <span class="font-semibold text-surface-700 dark:text-surface-200">สาเหตุ: </span>
          <span class="text-surface-900 dark:text-surface-0 font-medium">
            {{ banStore.banInfo?.reason || banStore.banMessage || 'ไม่ระบุ' }}
          </span>
        </div>

        <div>
          <span class="font-semibold text-surface-700 dark:text-surface-200">ระยะเวลา / วันหมดอายุ: </span>
          <span class="text-surface-900 dark:text-surface-0 font-medium">
            {{ banStore.formattedExpiresAt || 'ถาวร (PERMANENT)' }}
          </span>
        </div>
      </div>

      <div class="w-full mt-2">
        <Button
          label="ตกลง / ไปที่หน้าเข้าสู่ระบบ"
          pt:root:class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl border-none"
          @click="onConfirm" />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '~/volt/Dialog.vue'
import Button from '~/volt/Button.vue'
import { useBanStore } from '~/stores/Ban'

const banStore = useBanStore()
const router = useRouter()

function onConfirm (): void {
  banStore.hideBannedModal()
  void router.push({ name: 'auth-login' })
}
</script>

<style scoped>
</style>
