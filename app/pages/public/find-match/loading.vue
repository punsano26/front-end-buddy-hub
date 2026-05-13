<template>
  <div
    class="relative min-h-screen overflow-hidden bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-0"
  >
    <div class="absolute inset-0">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)]"
      />

      <div
        class="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-primary-400/20 blur-3xl dark:bg-primary-400/15"
      />
      <div
        class="absolute bottom-[-140px] right-[-120px] h-[320px] w-[320px] rounded-full bg-primary-600/20 blur-3xl dark:bg-primary-600/15"
      />
      <div
        class="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
        style="
          background-image:
            linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px);
          background-size: 40px 40px;
        "
      />
    </div>
    <div class="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
      <Card
        pt:root:class="w-full max-w-lg overflow-hidden rounded-[34px] border border-surface-200/70 bg-surface-0/80 backdrop-blur-2xl shadow-[0_20px_80px_rgba(15,23,42,0.18)] dark:border-surface-800/80 dark:bg-surface-900/80 dark:shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
        pt:body:class="p-0"
      >
        <template #content>
          <div
            class="relative overflow-hidden border-b border-surface-200/70 bg-gradient-to-br from-primary-300/20 via-primary-500/10 to-primary-700/20 px-8 pb-8 pt-10 dark:border-surface-800/70 dark:from-primary-500/15 dark:via-primary-600/10 dark:to-primary-700/15"
          >
            <div
              class="absolute left-10 top-10 h-2 w-2 animate-pulse rounded-full bg-primary-400"
            />

            <div
              class="absolute right-16 top-16 h-2 w-2 animate-pulse rounded-full bg-primary-300"
            />

            <div
              class="absolute bottom-10 left-20 h-1.5 w-1.5 animate-pulse rounded-full bg-surface-200 dark:bg-surface-0"
            />

            <div class="flex flex-col items-center text-center">
              <div class="relative mb-7">
                <div
                  class="absolute inset-0 rounded-full border border-primary-300/30 animate-ping dark:border-primary-500/30"
                />

                <div
                  class="absolute inset-[-16px] rounded-full border border-primary-300/20 dark:border-primary-500/20"
                />

          
                <div
                  class="flex h-28 w-28 items-center justify-center rounded-full border border-primary-300/30 bg-surface-0/40 backdrop-blur-xl dark:border-primary-500/30 dark:bg-surface-900/40"
                >
                  <div
                    class="absolute h-28 w-28 animate-spin rounded-full border-[3px] border-transparent border-t-primary-400 border-r-primary-600"
                  />

                  <div
                    class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 shadow-[0_0_35px_rgba(59,130,246,0.45)]"
                  >
                    <i class="pi pi-comments text-3xl text-white" />
                  </div>
                </div>
              </div>
              <h1 class="mb-2 text-3xl font-bold tracking-tight">
                Finding someone...
              </h1>

              <p class="max-w-sm text-sm leading-relaxed text-surface-500 dark:text-surface-300">
                Looking for someone who matches your vibe,
                interests, and conversation style.
              </p>
              <div
                class="mt-5 rounded-full border border-primary-300/30 bg-primary-200/30 px-4 py-1.5 text-sm font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200"
              >
                {{ timeElapsed }}s วินาที
              </div>
            </div>
          </div>
          <div class="space-y-6 p-8">
            <div>
              <div class="mb-2 flex items-center justify-between">
                <p class="text-sm text-surface-500 dark:text-surface-400">
                  Matching Progress
                </p>

                <p class="text-sm font-semibold text-primary-600 dark:text-primary-300">
                  {{ progress }}%
                </p>
              </div>

              <div
                class="h-3 overflow-hidden rounded-full bg-surface-200/70 dark:bg-surface-800/70"
              >
                <div
                  class="h-full rounded-full bg-gradient-to-r from-primary-300 via-primary-500 to-primary-700 transition-all duration-500"
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>

            <div class="flex flex-wrap justify-center gap-2">
              <div
                class="rounded-full border border-primary-300/30 bg-primary-200/30 px-3 py-1 text-xs text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200"
              >
                Friendly
              </div>

              <div
                class="rounded-full border border-primary-400/30 bg-primary-300/20 px-3 py-1 text-xs text-primary-700 dark:border-primary-600/30 dark:bg-primary-600/10 dark:text-primary-200"
              >
                Fun Chat
              </div>

              <div
                class="rounded-full border border-rose-300/30 bg-rose-200/30 px-3 py-1 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
              >
                Good Listener
              </div>
            </div>
            <NuxtLink
              :to="{ name: 'public-find-match' }"
              class="w-full">
              <Button
                label="Cancel Matching"
                icon="pi pi-times"
                severity="secondary"
                outlined
                pt:root:class="w-full !rounded-2xl !border-surface-300/70 !bg-surface-0/80 hover:!bg-surface-100 dark:!border-surface-700/80 dark:!bg-surface-900/60 dark:hover:!bg-surface-800"
              />
            </NuxtLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Button from '~/volt/Button.vue'
import Card from '~/volt/Card.vue'

definePageMeta({
  layout: 'default'
})

const maxTime = 15
const timeElapsed = ref(0)

const progress = computed(() =>
  Math.round((timeElapsed.value / maxTime) * 100)
)

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    timeElapsed.value++
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>