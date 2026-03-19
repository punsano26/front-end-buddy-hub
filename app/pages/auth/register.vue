<template>
  <form>
    <UploadImageProfile />
    <div class="grid md:flex md:gap-2 gap-4 pt-2">
      <InputLabelField
        label="อีเมล"
        placeholder="อีเมลของคุณ" />
      <InputLabelField
        label="ชื่อผู้ใช้"
        placeholder="ชื่อผู้ใช้ของคุณ" />
    </div>
    <div class="grid md:flex md:gap-2 gap-4">
      <InputLabelField
        label="เพศ">
        <Select
          class="w-full"
          placeholder="เลือกเพศของคุณ" />
      </InputLabelField>
      <InputLabelField label="วันเกิด">
        <DatePicker
          class="w-full"
          placeholder="เลือกวันเกิดของคุณ" />
      </InputLabelField>
    </div>
    <InputLabelField label="รหัสผ่าน">
      <InputPasswordField />
    </InputLabelField>
    <InputLabelField label="ยืนยันรหัสผ่าน">
      <InputPasswordField />
    </InputLabelField>
    <Button
      label="สมัครสมาชิก"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import InputLabelField from '~/components/input/InputLabelField.vue'
import UploadImageProfile from '~/components/input/UploadImageProfile.vue'

definePageMeta({
  title: 'สมัครสมาชิก'
})
</script>

<style scoped>

</style>
