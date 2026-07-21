<template>
  <Dialog
    v-model:visible="visible"
    :show-header="false"
    class="w-11/12 sm:max-w-[446px]"
    pt:content:class="p-0"
    pt:root:class="overflow-hidden rounded-[28px] shadow-2xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
    dismissable-mask
    modal>
    <!-- Header with logo and back/close buttons (like auth page layout) -->
    <div class="relative w-full flex flex-col items-center gap-4 px-[30px] pt-10 pb-2 text-center select-none">
      <!-- Back Button -->
      <button
        class="absolute left-6 top-6 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800/40 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="handleBack">
        <i class="pi pi-chevron-left text-lg" />
      </button>

      <!-- Close Button -->
      <button
        class="absolute right-6 top-6 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200 cursor-pointer w-8 h-8 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800/40 flex items-center justify-center border-none bg-transparent"
        type="button"
        @click="visible = false">
        <i class="pi pi-times text-sm" />
      </button>


      <!-- Title -->
      <h6 class="font-bold text-2xl text-surface-900 dark:text-white tracking-wide">
        TrueMoney Wallet
      </h6>

      <!-- Description -->
      <p class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 max-w-[340px]">
        กรอกเบอร์โทรศัพท์ที่ผูกกับบัญชี TrueMoney เพื่อชำระเงิน
      </p>
    </div>

    <!-- Amount Row -->
    <div class="flex items-center justify-between px-6 py-4 mx-6 my-2 bg-orange-500/5 dark:bg-orange-500/10 rounded-2xl border border-orange-500/20">
      <div class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
          <i class="pi pi-wallet text-orange-500 text-lg" />
        </span>
        <span class="text-sm font-bold text-surface-700 dark:text-surface-300">ยอดชำระเงิน</span>
      </div>
      <span class="text-2xl font-black text-orange-500">
        ฿{{ price }}
      </span>
    </div>

    <!-- Content Form -->
    <form
      class="px-6 flex flex-col gap-4 mt-2"
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
      <div class="mt-4">
        <button
          class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/10 transition-all duration-200 border-none text-base cursor-pointer"
          type="submit">
          ชำระเงินทันที
        </button>
      </div>
    </form>

    <div class="text-center text-[10px] text-surface-450 dark:text-surface-500 font-medium mt-6 mb-6 select-none">
      ปลอดภัยด้วยระบบชำระเงินที่ได้มาตรฐาน
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
