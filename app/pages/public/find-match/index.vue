<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 py-12 gap-8">
    <div class="p-4 rounded-2xl bg-gradient-primary shadow-[0_10px_30px_rgba(120,120,255,0.3)]">
      <i class="pi pi-link text-3xl text-white" />
    </div>
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-white">
        จับคู่เพื่อนใหม่
      </h1>
      <p class="text-sm text-surface-500 dark:text-surface-400 max-w-md">
        กดสุ่มเพื่อค้าหาคนแปลกหน้าทันทีเพื่อแชท, สร้างมิตรภาพใหม่ หรือกดข้ามเพื่อหาเพื่อนใหม่ที่น่าสนใจอื่นๆ
      </p>
    </div>
    <MatchingFilter
      v-model:payload="payload"
      class="w-full max-w-md" />
    <Button
      @click="handleMatch"
      size="large"
      icon="pi pi-bolt"
      label="เริ่มจับคู่ตอนนี้"
      pt:root:class="w-full max-w-xs bg-gradient-primary border-none rounded-xl py-3
        text-white font-semibold tracking-wide
        shadow-lg shadow-indigo-500/30
        hover:scale-105 active:scale-95 transition-all duration-200"
    />

    <div class="grid grid-cols-3 gap-4 w-full max-w-md">
      <Card pt:root:class="rounded-xl bg-white/60 dark:bg-surface-800/60 backdrop-blur shadow-sm">
        <template #content>
          <div class="flex flex-col items-center gap-1 py-2">
            <p class="text-lg font-bold text-green-500">13</p>
            <p class="text-xs text-surface-500">ออนไลน์</p>
          </div>
        </template>
      </Card>
      <Card pt:root:class="rounded-xl bg-white/60 dark:bg-surface-800/60 backdrop-blur shadow-sm">
        <template #content>
          <div class="flex flex-col items-center gap-1 py-2">
            <p class="text-lg font-bold text-primary">132</p>
            <p class="text-xs text-surface-500">ผู้ใช้ทั้งหมด</p>
          </div>
        </template>
      </Card>

     
      <Card pt:root:class="rounded-xl bg-white/60 dark:bg-surface-800/60 backdrop-blur shadow-sm">
        <template #content>
          <div class="flex flex-col items-center gap-1 py-2">
            <p class="text-lg font-bold text-indigo-500">~1 นาที</p>
            <p class="text-xs text-surface-500">เวลารอ</p>
          </div>
        </template>
      </Card>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import MatchingFilter from '~/components/input/MatchingFilter.vue'
import { genderQueryEnum } from '~/models/enums/User.enum'
import type { IJoinTheRandomMatchQueuePayload } from '~/models/request/MatchReq.model'
import type { IMatchProvider } from '~/resource/provider/Match.provider'
import MatchProvider from '~/resource/provider/Match.provider'

definePageMeta({ layout: "navbar" })

const matchService: IMatchProvider = new MatchProvider()
const toast = useToast()
const router = useRouter()
const payload = ref<IJoinTheRandomMatchQueuePayload>({
  gender: genderQueryEnum.ALL,
  minAge: 16,
  maxAge: 26
})
const { $handleLoading } = useNuxtApp()
async function onMatch (): Promise<void> {
  if (import.meta.client) {
    const { $wsConnect } = useNuxtApp() as any
    if (typeof $wsConnect === 'function') {
      $wsConnect()
    }
  }
  await matchService.JoinTheRandomMatchQueue(payload.value)
  router.push({ name: 'public-find-match-loading' })
}

function handleMatch (): void {
  $handleLoading(onMatch, {
    toast: {
      instance: toast
    }
  })

}
</script>

<style>

</style>