<template>
  <Transition name="fade">
    <div
      v-if="isOverlayVisible"
      class="loading-overlay">
      <div class="spinner" />
      <p>กำลังโหลด...</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '~/stores/Loading'

const nuxtApp = useNuxtApp()
const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
const isPageLoading = ref(false)
const isOverlayVisible = computed(
  (): boolean => isPageLoading.value || isLoading.value
)

nuxtApp.hook('page:start', (): void => {
  isPageLoading.value = true
})

nuxtApp.hook('page:finish', (): void => {
  isPageLoading.value = false
})

nuxtApp.hook('app:error', (): void => {
  isPageLoading.value = false
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
