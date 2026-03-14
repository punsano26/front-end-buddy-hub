<template>
  <form>
    <InputLabelField
      label="อีเมล" />
    <InputLabelField label="รหัสผ่าน">
      <InputPasswordField />
    </InputLabelField>
    <Button
      label="เข้าสู่ระบบ"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
    <NuxtLink
      :to="{ name: 'auth-forgot-password' }"
      class="text-center text-blue-400">
      ลืมรหัสผ่าน ?
    </NuxtLink>
  </form>
</template>

<script setup lang="ts">
import InputLabelField from '~/components/input/InputLabelField.vue'
import InputPasswordField from '~/components/input/InputPasswordField.vue'

definePageMeta({
  title: 'เข้าสู่ระบบเพื่อใช้งาน'
})
</script>

<style scoped>

</style>
