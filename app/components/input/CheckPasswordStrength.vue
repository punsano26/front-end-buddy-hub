<template>
  <div v-if="interacted">
    <div
      :style="{ color: strength.color }"
      class="text-sm mt-[-10px] mb-2">
      {{ strength.message }}
    </div>
    <ProgressBar
      :pt="{
        value: { style: { background: strength.color, transition: 'all 0.3s ease', padding: '0px' } }
      }"
      :value="strength.score"
      class="mb-6"
      style="height: 10px" />
    <p class="text-xs text-surface-400">
      รหัสผ่านควรมีทั้งตัวอักษร (A-Z) ตัวเลข (0-9) และสัญลักษณ์ (เช่น ! @ # % _) ผสมกัน
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ProgressBar from 'primevue/progressbar'

interface IProps {
  password: string
}
interface PasswordResult {
  score: number
  color: string
  message: string
}
const props = defineProps<IProps>()
const interacted = ref(false)

watch((): string => props.password, (newValue: string): void => {
  if (!interacted.value && newValue) {
    interacted.value = true
  }
})

function checkPasswordStrength (password: string): PasswordResult {
  if (!password) {
    return { score: 0, color: 'grey', message: '' }
  }
  if (password.length > 0 && password.length < 8) {
    return { score: 10, color: '#E73C3F', message: 'ยังไม่ครบ 8 ตัว' }
  }

  let typeCount = 0
  if ((/[A-Z]/).test(password)) typeCount++
  if ((/[a-z]/).test(password)) typeCount++
  if ((/[0-9]/).test(password)) typeCount++
  if ((/[^A-Za-z0-9]/).test(password)) typeCount++

  switch (typeCount) {
    case 1:
      return { score: 20, color: '#E73C3F', message: 'ปลอดภัยต่ำมาก' }
    case 2:
      return { score: 40, color: '#ff8f00', message: 'ปลอดภัยระดับต่ำ' }
    case 3:
      return { score: 70, color: '#FCB717', message: 'ปลอดภัยปานกลาง' }
    case 4:
      return { score: 100, color: '#27AE60', message: 'ปลอดภัยมาก' }
    default:
      // This case should ideally not be reached if password has length >= 8
      return { score: 0, color: 'grey', message: '' }
  }
}

const strength = computed<PasswordResult>((): PasswordResult =>
  checkPasswordStrength(props.password)
)
</script>

<style scoped>
</style>
