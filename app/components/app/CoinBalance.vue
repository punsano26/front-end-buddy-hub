<template>
  <div>
    <button
      class="relative flex h-10 items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/80 px-3 transition-all duration-200 hover:border-amber-300/80 hover:bg-amber-100/80 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-amber-400/25 dark:bg-amber-400/10 dark:hover:border-amber-400/40 dark:hover:bg-amber-400/20"
      type="button"
      @click="toggle">
      <i class="pi pi-bitcoin text-sm text-amber-600 dark:text-amber-400" />
      <span class="text-xs font-bold tabular-nums text-amber-800 sm:text-sm dark:text-amber-200">
        {{ formattedBalance }}
      </span>
    </button>

    <Popover
      ref="op"
      pt:content:class="p-0"
      pt:root:class="rounded-2xl shadow-2xl border border-surface-100 dark:border-surface-800 overflow-hidden">
      <div class="flex w-72 flex-col bg-white dark:bg-surface-900">
        <div class="relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-50/50 to-orange-50/40 px-5 py-4 dark:from-amber-400/10 dark:via-surface-900/80 dark:to-orange-400/5">
          <div class="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-300/20 blur-xl dark:bg-amber-400/10" />
          <div class="relative flex items-center justify-between">
            <div class="flex flex-col gap-0.5">
              <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600/70 dark:text-amber-300/60">
                เหรียญของฉัน
              </span>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {{ formattedBalance }}
                </span>
                <span class="text-xs font-medium text-amber-600/80 dark:text-amber-300/70">
                  เหรียญ
                </span>
              </div>
            </div>
            <div class="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-100 to-amber-200/80 shadow-sm dark:border-amber-400/25 dark:from-amber-400/25 dark:to-amber-500/15">
              <i class="pi pi-bitcoin text-lg text-amber-600 dark:text-amber-300" />
            </div>
          </div>
        </div>

        <div class="p-3">
          <button
            class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-300/50 bg-white/80 px-3 py-2 text-xs font-semibold text-amber-800 shadow-sm backdrop-blur transition-all duration-200 hover:border-amber-300 hover:bg-white hover:shadow-md active:scale-[0.98] dark:border-amber-400/25 dark:bg-white/10 dark:text-amber-100 dark:hover:bg-white/20"
            type="button"
            @click="$emit('topup')">
            <i class="pi pi-plus text-[10px]" />
            <span>เติมเหรียญ</span>
          </button>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  balance?: number
}

defineEmits<{
  topup: []
}>()

const op = ref()
const toggle = (event: Event): void => {
  op.value.toggle(event)
}

const props = withDefaults(defineProps<Props>(), {
  balance: 0
})

const formattedBalance = computed((): string => {
  return props.balance.toLocaleString('th-TH')
})
</script>
