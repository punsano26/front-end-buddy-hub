<template>
  <div class="px-4 py-4 sm:px-6 lg:px-12">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
      <div class="flex flex-col items-center justify-center gap-3 text-center sm:gap-4">
        <Button
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
          size="medium">
          <i :class="selectedPolicyIcon" />
        </Button>
        <p class="text-lg font-semibold sm:text-xl">
          {{ currentPolicy?.title || 'นโยบายและความปลอดภัย' }}
        </p>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          ความปลอดภัยของคุณคือสิ่งสำคัญที่สุด เรียนรู้วิธีใช้ BuddyHub อย่างปลอดภัย และทำความเข้าใจเงื่อนไขการใช้งาน
        </p>
        <p
          v-if="currentPolicy?.createdAt"
          class="text-xs text-slate-500 sm:text-sm">
          อัปเดตล่าสุด: {{ dayjs(currentPolicy.createdAt).format('DD/MM/YYYY') }} (v{{ currentPolicy.version }})
        </p>
      </div>

      <!-- Policy Type Switcher -->
      <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Button
          v-for="item in policyTabs"
          :key="item.type"
          :outlined="selectedType !== item.type"
          :severity="selectedType === item.type ? undefined : 'secondary'"
          class="w-full sm:w-auto rounded-xl"
          size="small"
          @click="selectPolicyType(item.type)">
          <i
            :class="item.icon"
            class="mr-2" />
          {{ item.label }}
        </Button>
      </div>

      <Card class="w-full shadow-sm rounded-2xl">
        <template #content>
          <div
            v-if="currentPolicy?.detail"
            class="whitespace-pre-line text-sm leading-relaxed sm:text-base text-slate-700 dark:text-slate-200">
            {{ currentPolicy.detail }}
          </div>
          <div
            v-else
            class="text-center py-8 text-slate-400 text-sm">
            ไม่พบข้อมูลนโยบาย
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { policyTypeEnum } from '~/models/enums/Policy.enum'
import type { IPolicyData } from '~/models/response/PolicyRes.model'
import PolicyProvider, { type IPolicyProvider } from '~/resource/provider/Policy.provider'

interface IPolicyTab {
  type: policyTypeEnum
  label: string
  icon: string
}

definePageMeta({
  backPath: { name: 'auth-register' }
})

const route = useRoute()
const policies = ref<IPolicyData[]>([])
const selectedType = ref<policyTypeEnum>(policyTypeEnum.SAFETY_INSTRUCTIONS)
const { $handleLoading } = useNuxtApp()
const policyService: IPolicyProvider = new PolicyProvider()

const policyTabs = computed((): IPolicyTab[] => [
  {
    type: policyTypeEnum.SAFETY_INSTRUCTIONS,
    label: 'คำแนะนำด้านความปลอดภัย',
    icon: 'pi pi-shield'
  },
  {
    type: policyTypeEnum.TERMS_OF_USE,
    label: 'ข้อกำหนดการใช้งาน',
    icon: 'pi pi-file'
  },
  {
    type: policyTypeEnum.PRIVACY_POLICY,
    label: 'นโยบายความเป็นส่วนตัว',
    icon: 'pi pi-lock'
  }
])

const currentPolicy = computed((): IPolicyData | undefined => {
  return policies.value.find((p: IPolicyData): boolean => p.policyType === selectedType.value)
    || policies.value[0]
})

const selectedPolicyIcon = computed((): string => {
  switch (selectedType.value) {
    case policyTypeEnum.TERMS_OF_USE:
      return 'pi pi-file'
    case policyTypeEnum.PRIVACY_POLICY:
      return 'pi pi-lock'
    case policyTypeEnum.SAFETY_INSTRUCTIONS:
    default:
      return 'pi pi-exclamation-triangle'
  }
})

function selectPolicyType (type: policyTypeEnum): void {
  selectedType.value = type
}

async function useFetch (): Promise<void> {
  const response = await policyService.findLatestPolicies()
  policies.value = response.data || []

  // If URL query specifies a valid policy type, select it
  const queryType = route.query.type as string
  if (queryType && Object.values(policyTypeEnum).includes(queryType as policyTypeEnum)) {
    selectedType.value = queryType as policyTypeEnum
  } else if (policies.value.length > 0) {
    const hasSafety = policies.value.some((p: IPolicyData): boolean => p.policyType === policyTypeEnum.SAFETY_INSTRUCTIONS)
    if (hasSafety) {
      selectedType.value = policyTypeEnum.SAFETY_INSTRUCTIONS
    } else {
      selectedType.value = policies.value[0]?.policyType ?? policyTypeEnum.SAFETY_INSTRUCTIONS
    }
  }
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted((): void => {
  fetch()
})
</script>

<style scoped>
</style>
