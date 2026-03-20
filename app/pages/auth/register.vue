<template>
  <form @submit.prevent="register()">
    <UploadImageProfile />
    <div class="grid md:flex md:gap-2 gap-4 pt-2">
      <InputLabelField
        v-model="form.email"
        label="อีเมล"
        placeholder="อีเมลของคุณ" />
      <InputLabelField
        v-model="form.username"

        label="ชื่อผู้ใช้"
        placeholder="ชื่อผู้ใช้ของคุณ" />
    </div>
    <div class="grid md:flex md:gap-2 gap-4">
      <InputLabelField
        label="เพศ">
        <Select
          v-model="form.gender"
          :options="gender"
          class="w-full"
          option-label="label"
          option-value="value"
          placeholder="เลือกเพศของคุณ" />
      </InputLabelField>
      <InputBirthDatePicker
        v-model="form.dateOfBirth"
        label="วันเกิด"
        placeholder="เลือกวันเกิดของคุณ"
        required />
    </div>
    <InputLabelField

      label="รหัสผ่าน">
      <InputPasswordField v-model="form.password" />
    </InputLabelField>
    <InputLabelField

      label="ยืนยันรหัสผ่าน">
      <InputPasswordField v-model="form.confirmPassword" />
    </InputLabelField>
    <Button
      label="สมัครสมาชิก"
      pt:label:class="font-bold"
      pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
      type="submit" />
  </form>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import InputLabelField from '~/components/input/InputLabelField.vue'
import UploadImageProfile from '~/components/input/UploadImageProfile.vue'
import type { IBaseOptions } from '~/models/Global.model'
import { genderEnum, type IAuthRegisterPayload } from '~/models/request/AuthReq.model'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'

definePageMeta({
  title: 'สมัครสมาชิก'
})

const authService: IAuthProvider = new AuthProvider()
const toast = useToast()
const { $handleLoading } = useNuxtApp()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()


const form = ref<IAuthRegisterPayload>({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  gender: genderEnum.MALE,
  dateOfBirth: ''
})


const gender = ref<IBaseOptions[]>([
  {
    label: 'ผู้ชาย',
    value: 'male'
  },
  {
    label: 'ผู้หญิง',
    value: 'female'
  },
  {
    label: 'อื่นๆ',
    value: 'other'
  }
])


async function onRegister (): Promise<void> {
  if (!form.value.email || !form.value.username || !form.value.password || !form.value.confirmPassword
    || !form.value.gender || !form.value.dateOfBirth) {
    return
  }

  const payload: IAuthRegisterPayload = {
    email: form.value.email,
    username: form.value.username,
    password: form.value.password,
    confirmPassword: form.value.confirmPassword,
    gender: form.value.gender,
    dateOfBirth: form.value.dateOfBirth
  }
  const response = await authService.register(payload)
  authStore.userLogin(response.data, response.accessToken, response.refreshToken)
  router.push({ name: 'public-home' })
}

function register (): void {
  if (!form.value.email.trim() || !form.value.username.trim() || !form.value.dateOfBirth.trim()
    || !form.value.password.trim() || !form.value.confirmPassword.trim()) {
    return
  }
  $handleLoading(onRegister, {
    toast: {
      instance: toast
    }
  })
}

onBeforeMount((): void => {
  if (route.query.account) return
  router.replace({ name: 'auth-verify' })
})
</script>

<style scoped>

</style>
