<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="onSubmit">
    <InputLabelField
      v-model="account"
      :rules="formRules.account"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputLabelField from '~/components/input/InputLabelField.vue'
import { validate, validateForm } from '~/plugins/Validate'
import type { IAuthProvider } from '~/resource/provider/Auth.provider'
import AuthProvider from '~/resource/provider/Auth.provider'
import Button from '~/volt/Button.vue'

definePageMeta({
  title: 'เข้าสู่ระบบ',
  description: 'กรอกอีเมลหรือชื่อผู้ใช้ของคุณเพื่อเข้าสู่ระบบ'
})

const authService: IAuthProvider = new AuthProvider()

const router = useRouter()
const toast = useToast()
const { $handleLoading } = useNuxtApp()

const account = ref<string>('')
const submitted = ref(false)

const formRules = computed((): Record<string, ((v: any) => boolean | string)[]> => ({
  account: [validate.required, validate.account]
}))

async function onVerify (): Promise<void> {
  const value = account.value?.trim()

  if (!value) {
    return
  }

  const payload = {
    account: value
  }

  const response = await authService.checkAuth(payload)

  console.log('CHECK AUTH RESPONSE', response)

  const exists = response?.data?.exists

  await router.push({
    name: exists ? 'auth-login' : 'auth-register',
    query: {
      account: value
    }
  })
}

async function onSubmit (): Promise<void> {
  submitted.value = true

  if (!validateForm({ account: account.value }, formRules.value)) {
    return
  }

  await $handleLoading(
    async (): Promise<void> => {
      await onVerify()
    }, {
      toast: {
        instance: toast
      }
    }
  )
}
</script>
