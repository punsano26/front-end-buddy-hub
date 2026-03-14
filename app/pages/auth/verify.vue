<template>
  <form @submit.prevent="onSubmit">
    <InputLabelField
      :rules="[validate.required]"
      :show-error="submitted"
      label="อีเมลหรือชื่อผู้ใช้"
      placeholder="อีเมลหรือชื่อผู้ใช้"
      required />
    <Button
      label="ถัดไป"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import InputLabelField from '~/components/input/InputLabelField.vue'
import { validate } from '~/plugins/Validate'
import Button from '~/volt/Button.vue'

definePageMeta({
  title: 'เข้าสู่ระบบ',
  description: 'กรอกอีเมลหรือชื่อผู้ใช้ของคุณเพื่อเข้าสู่ระบบ'
})

const submitted = ref(false)

function onSubmit (): void {
  submitted.value = true
}
</script>
