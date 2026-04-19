<template>
  <div class="border rounded-2xl">
    <div class="flex items-start gap-3 p-4">
      <Checkbox
        v-model="checked"
        variant="filled"
        binary />
      <p class="text-sm sm:text-base">
        ฉันได้อ่านและยอมรับ <NuxtLink
          :to="{ path: '/policy/protect', query: route.query }"
          class="text-blue-500 underline">นโยบายความปลอดภัย</NuxtLink> ของ BuddyHub แล้ว
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checked = computed({
  get: (): boolean => props.modelValue,
  set: (value: boolean): void => {
    emit('update:modelValue', value)
  }
})
const route = useRoute()
</script>

<style>

</style>
