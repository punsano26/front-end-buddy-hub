<template>
  <div class="px-4 py-4 sm:px-6 lg:px-12">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
      <div class="flex flex-col items-center justify-center gap-3 text-center sm:gap-4">
        <Button
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
          size="medium">
          <i class="pi pi-exclamation-triangle" />
        </Button>
        <p class="text-lg font-semibold sm:text-xl">
          {{ policyItem?.title }}
        </p>
        <p class="text-sm sm:text-base">
          ความปลอดภัยของคุณคือสิ่งสำคัญที่สุด เรียนรู้วิธีใช้ BuddyHub อย่างปลอดภัย โดยเฉพาะเมื่อพูดคุยกับคนแปลกหน้า
        </p>
        <p class="text-xs text-slate-500 sm:text-sm">
          {{ policyItem?.createdAt }}
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Button
          class="w-full sm:w-auto"
          size="small">
          <i class="pi pi-shield" />
          ความปลอดภัยของบัญชี
        </Button>
        <Button
          class="w-full sm:w-auto"
          size="small">
          <i class="pi pi-lock" />
          ความปลอดภัยของข้อมูล
        </Button>
        <Button
          class="w-full sm:w-auto"
          size="small">
          <i class="pi pi-exclamation-triangle" />
          ความปลอดภัยในการพบปะ
        </Button>
      </div>

      <Card class="w-full">
        <template #content>
          <div class="whitespace-pre-line text-sm leading-relaxed sm:text-base">
            {{ policyItem?.detail }}
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IFindTheLatestPolicyData } from '~/models/response/Policy.model'
import PolicyProvider, { type IPolicyProvider } from '~/resource/provider/Policy.provider'

definePageMeta({
  backPath: { name: 'auth-register' }
})
const policyItem = ref<IFindTheLatestPolicyData>()
const { $handleLoading } = useNuxtApp()
const policyService: IPolicyProvider = new PolicyProvider()

async function useFetch (): Promise<void> {
  const response = await policyService.findTheLatestPolicy()
  policyItem.value = response.data
}
function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style>

</style>
