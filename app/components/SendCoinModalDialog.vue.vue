<template>
  <Dialog
    v-model:visible="model"
    :modal="true"
    :pt="{
      root: { class: 'border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl max-w-[400px] w-[95%] overflow-hidden' },
      mask: { class: 'backdrop-blur-xs bg-black/40' },
      header: { class: 'flex items-center justify-between p-5 pb-3 border-b border-slate-100 dark:border-slate-800/60' },
      content: { class: 'p-5 pt-4' }
    }">
    <template #header>
      <div class="flex items-center gap-2">
        <span class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
          <i class="pi pi-gift text-base" />
        </span>
        <span class="text-base font-bold text-slate-800 dark:text-slate-100">
          ส่งเหรียญ
        </span>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Recipient Profile Card -->
      <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
        <div class="relative shrink-0">
          <img
            :src="props.avatar ? imageBaseUrl + props.avatar : '/png/upload-profile.png'"
            alt="profile"
            class="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm">
          <span class="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-slate-900 shadow-xs">
            <i class="pi pi-arrow-up-right text-[8px]" />
          </span>
        </div>
        <div class="min-w-0">
          <p class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
            ส่งให้
          </p>
          <h3 class="truncate font-bold text-sm text-slate-800 dark:text-slate-100">
            {{ props.nickname || props.username }}
          </h3>
          <p class="truncate text-xs text-slate-400 dark:text-slate-500">
            @{{ props.username }}
          </p>
        </div>
      </div>

      <!-- Current Balance Card -->
      <div class="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20">
        <div class="flex items-center gap-2">
          <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
            <i class="pi pi-wallet text-sm" />
          </span>
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            ยอดเหรียญคงเหลือของคุณ
          </span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-base font-bold text-blue-600 dark:text-blue-400">
            {{ props.coinBalance }}
          </span>
          <span class="text-[10px] font-bold text-blue-500/80 dark:text-blue-400/80">
            COINS
          </span>
        </div>
      </div>

      <!-- Form Inputs -->
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400">จำนวนเหรียญที่จะส่ง</label>
          <div class="relative flex items-center">
            <InputNumber
              v-model="formSendCoins.amount"
              :max="props.coinBalance"
              :min="1"
              :pt="{
                pcInputText: {
                  root: 'w-full !rounded-xl !p-3 !pr-10 !border-slate-200 dark:!border-slate-800 bg-white dark:bg-slate-950 focus:!border-blue-500 focus:!ring-1 focus:!ring-blue-500/30 transition-all font-bold text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600'
                }
              }"
              class="w-full"
              placeholder="ระบุจำนวนเหรียญ..." />
            <span class="absolute right-3 text-xs font-bold text-blue-500">
              <img
                alt="coin"
                class="h-4 w-4 inline-block dark:hidden"
                src="/svg/coin-logo-black.svg">
              <img
                alt="coin"
                class="h-4 w-4 inline-block hidden dark:inline-block"
                src="/svg/coin-logo-white.svg">
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400">คำอธิบายเพิ่มเติม</label>
          <InputTextarea
            v-model="formSendCoins.description"
            :pt="{
              root: 'w-full !rounded-xl !p-3 !border-slate-200 dark:!border-slate-800 bg-white dark:bg-slate-950 focus:!border-blue-500 focus:!ring-1 focus:!ring-blue-500/30 transition-all text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600'
            }"
            class="w-full"
            placeholder="คำอธิบาย (ไม่บังคับ)"
            rows="3" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="grid grid-cols-2 gap-3 mt-2">
        <CancelButton
          class="w-full !rounded-xl py-2.5 font-semibold text-sm transition active:scale-[0.98] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
          text="ยกเลิก"
          @click="onCancel" />
        <ConfirmButton
          :text="confirmButton"
          class="w-full !bg-gradient-primary hover:opacity-95 !text-white !border-none !rounded-xl py-2.5 font-semibold text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/10 transition active:scale-[0.98]"
          @click="onConfirm" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { ISendCoinsToAnotherUserPayload } from '~/models/request/WalletReq.model'

interface IProps {
  nickname?: string | null
  username?: string | null
  coinBalance?: number
  avatar?: string | null
}

const props = withDefaults(defineProps<IProps>(), {
  nickname: '',
  username: '',
  coinBalance: 0,
  avatar: ''
})

const model = defineModel<boolean>('visible')
const formSendCoins = defineModel<ISendCoinsToAnotherUserPayload>('formSendCoins', { required: true })

const confirmButton = ref('ยืนยัน')
const imageBaseUrl = (import.meta.env.VITE_ENV_BASE_FILE_URL as string || '') + '/'

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function onConfirm (): void {
  emit('confirm')
}

function onCancel (): void {
  model.value = false
  emit('cancel')
}
</script>
