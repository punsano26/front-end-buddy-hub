<template>
  <div class="relative inline-block">
    <!-- Trigger Button -->
    <button
      class="group relative flex h-10 items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/60 px-3.5 shadow-sm transition-all duration-300 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-amber-500/20 dark:bg-amber-500/10 dark:hover:border-amber-400/40 dark:hover:bg-amber-500/20"
      type="button"
      @click="toggle">
      <!-- Glow Underlay Effect -->
      <span class="absolute inset-0 -z-10 rounded-full bg-gradient-primary opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-15 dark:group-hover:opacity-20" />

      <!-- Coin Icon with rotation -->
      <span class="relative flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:bg-amber-400/15 dark:text-amber-400">
        <i class="pi pi-bitcoin text-sm transition-transform duration-750 group-hover:rotate-[360deg] animate-[pulse_2s_infinite]" />
      </span>

      <!-- Balance display or skeleton loader -->
      <Skeleton
        v-if="isLoading && currentBalance === 0"
        class="bg-amber-200/50 dark:bg-amber-700/50"
        height="1rem"
        width="2.5rem" />
      <span
        v-else
        class="text-xs font-bold tabular-nums text-amber-900 sm:text-sm dark:text-amber-200">
        {{ formattedBalance }}
      </span>

      <i class="pi pi-chevron-down text-[10px] text-amber-600/70 transition-transform duration-300 group-hover:translate-y-0.5 dark:text-amber-400/60" />
    </button>

    <!-- Popover Details -->
    <Popover
      ref="op"
      pt:content:class="p-0"
      pt:root:class="rounded-2xl shadow-2xl border border-surface-100 dark:border-surface-800 overflow-hidden backdrop-blur-xl">
      <div class="flex w-80 flex-col bg-white/95 dark:bg-surface-900/95">
        <!-- Header with metallic gradient and brand color touch -->
        <div class="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-purple-600/5 px-6 py-5 dark:from-amber-500/20 dark:via-surface-900 dark:to-purple-900/10 border-b border-surface-100 dark:border-surface-800/60">
          <div class="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl dark:bg-amber-500/10" />
          <div class="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-primary-400/15 blur-2xl dark:bg-primary-500/5" />

          <div class="relative flex items-center justify-between">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                กระเป๋าเงินของฉัน
              </span>
              <div class="flex items-baseline gap-1.5 mt-1">
                <span class="text-3xl font-extrabold tabular-nums tracking-tight text-surface-900 dark:text-white">
                  {{ formattedBalance }}
                </span>
                <span class="text-xs font-semibold text-amber-600/90 dark:text-amber-400/90">
                  เหรียญ
                </span>
              </div>
            </div>

            <!-- Rotating/Glowing coin icon container -->
            <div class="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/40 bg-gradient-to-br from-amber-400/30 to-orange-500/20 shadow-md dark:border-amber-400/30 dark:from-amber-500/25 dark:to-orange-600/20">
              <i class="pi pi-bitcoin text-2xl text-amber-500 dark:text-amber-400 animate-[spin_8s_linear_infinite]" />
              <span class="absolute inset-0 animate-ping rounded-2xl bg-amber-400/20 opacity-30 duration-1000" />
            </div>
          </div>
        </div>

        <!-- Info & Actions -->
        <div class="p-4 flex flex-col gap-4">
          <!-- Action Buttons (Refresh & Top-up) -->
          <div class="flex gap-2">
            <!-- Refresh balance -->
            <Button
              aria-label="รีเฟรชยอดคงเหลือ"
              class="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-200 bg-surface-50 hover:bg-surface-100 text-surface-600 transition-all active:scale-95 dark:border-surface-800 dark:bg-surface-800/50 dark:hover:bg-surface-800 dark:text-surface-300"
              type="button"
              @click="fetchBalance">
              <i
                :class="{ 'animate-spin': isLoading }"
                class="pi pi-sync text-xs" />
            </Button>

            <!-- Top up -->
            <Button
              class="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-primary hover:opacity-95 text-xs font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] border-none"
              type="button"
              @click="handleTopupClick">
              <i class="pi pi-plus text-[10px] text-white" />
              <span class="text-white">เติมเหรียญ</span>
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/Auth'
import WalletProvider from '~/resource/provider/Wallet.provider'
import Button from '~/volt/Button.vue'
import Popover from '~/volt/Popover.vue'
import Skeleton from '~/volt/Skeleton.vue'

interface Props {
  balance?: number
}

const emit = defineEmits<{
  topup: []
}>()

const props = withDefaults(defineProps<Props>(), {
  balance: undefined
})

const { $handleLoading } = useNuxtApp()
const authStore = useAuthStore()
const walletService = new WalletProvider()
const localBalance = ref<number | null>(null)
const isLoading = ref<boolean>(false)
const op = ref()

const currentBalance = computed((): number => {
  if (props.balance !== undefined) {
    return props.balance
  }
  return localBalance.value ?? 0
})

const formattedBalance = computed((): string => {
  return currentBalance.value.toLocaleString('th-TH')
})

const onFetchBalance = async (): Promise<void> => {
  const response = await walletService.findWalletBalance()
  if (response?.data) {
    localBalance.value = response.data.balance
  }
}

const fetchBalance = (): void => {
  if (!authStore.user.id) return
  $handleLoading(onFetchBalance, { loadingUnit: isLoading })
}

const toggle = (event: Event): void => {
  op.value.toggle(event)
  if (op.value && props.balance === undefined) {
    fetchBalance()
  }
}

const handleTopupClick = (): void => {
  emit('topup')
  if (op.value) {
    op.value.hide()
  }
}

onMounted((): void => {
  if (props.balance === undefined) {
    fetchBalance()
  }
})

watch((): number => authStore.user.id, (newId: number): void => {
  if (newId && props.balance === undefined) {
    fetchBalance()
  } else if (!newId) {
    localBalance.value = 0
  }
})
</script>
