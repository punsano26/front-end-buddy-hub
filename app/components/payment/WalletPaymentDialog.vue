<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[460px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header -->
    <div class="relative w-full flex flex-col items-center gap-3 px-6 pt-8 pb-3 text-center select-none">
      <!-- Back Button -->
      <button
        class="absolute left-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="handleBack">
        <i class="pi pi-chevron-left text-base" />
      </button>

      <!-- Close Button -->
      <button
        class="absolute right-5 top-5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>

      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-500/20">
        <i class="pi pi-wallet text-xs" />
        <span>TrueMoney Wallet</span>
      </div>

      <h6 class="font-extrabold text-2xl text-surface-900 dark:text-white tracking-wide">
        ชำระเงินด้วย TrueMoney
      </h6>

      <p class="text-xs text-surface-500 dark:text-surface-400 max-w-[340px]">
        กรอกเบอร์โทรศัพท์ที่ผูกกับบัญชี TrueMoney เพื่อชำระเงิน
      </p>
    </div>

    <!-- Amount Row -->
    <div class="flex items-center justify-between px-5 py-3.5 mx-6 my-1 bg-orange-500/5 dark:bg-orange-500/10 rounded-2xl border border-orange-500/20">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-2xl bg-orange-500/15 flex items-center justify-center">
          <i class="pi pi-wallet text-orange-500 text-lg" />
        </span>
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-semibold text-surface-400">เหรียญที่จะได้รับ</span>
          <span class="text-base font-extrabold text-surface-900 dark:text-surface-50 tabular-nums">
            {{ coins.toLocaleString('th-TH') }} เหรียญ
          </span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-[11px] font-semibold text-surface-400">ยอดชำระเงิน</span>
        <span class="text-2xl font-black text-orange-500 tabular-nums">
          ฿{{ price.toLocaleString('th-TH') }}
        </span>
      </div>
    </div>

    <!-- Content Form -->
    <form
      class="px-6 flex flex-col gap-4 mt-3"
      @submit.prevent="handleSubmit">
      <InputLabelField
        v-model="phoneNumber"
        :rules="phoneRules"
        :show-error="submitted"
        label="เบอร์โทรศัพท์ TrueMoney"
        maxlength="10"
        placeholder="เช่น 0801234567"
        type="text"
        required
        @input="onPhoneInput" />

      <!-- Button -->
      <div class="mt-2">
        <button
          class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all duration-200 border-none text-sm cursor-pointer"
          type="submit">
          ชำระเงินทันที
        </button>
      </div>
    </form>

    <div class="flex items-center justify-center gap-1.5 text-center text-[10px] text-surface-400 dark:text-surface-500 font-medium mt-4 mb-6 select-none px-6">
      <i class="pi pi-shield-check text-emerald-500 text-xs" />
      <span>ปลอดภัยด้วยระบบชำระเงินที่ได้มาตรฐาน</span>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from '~/volt/Dialog.vue'
import InputLabelField from '~/components/input/InputLabelField.vue'
import { validate } from '~/plugins/Validate'

interface Props {
  coins?: number
  price?: number
}

const props = withDefaults(defineProps<Props>(), {
  coins: 50,
  price: 35
})

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{
  (e: 'back'): void
}>()

const toast = useToast()
const phoneNumber = ref<string>('')
const submitted = ref<boolean>(false)

const phoneRules = [
  validate.required,
  (val: string): boolean | string => {
    return val.length === 10 || 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก'
  }
]

const onPhoneInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  phoneNumber.value = target.value.replace(/\D/g, '')
}

const handleBack = (): void => {
  emit('back')
}

const handleSubmit = (): void => {
  submitted.value = true
  if (phoneNumber.value.length !== 10) {
    return
  }

  toast.add({
    severity: 'success',
    summary: 'ชำระเงินสำเร็จ',
    detail: `ระบบได้หักเงินจากบัญชี TrueMoney เรียบร้อยแล้ว ได้รับ ${props.coins} เหรียญ`,
    life: 5000
  })
  visible.value = false
  phoneNumber.value = ''
  submitted.value = false
}
</script>
