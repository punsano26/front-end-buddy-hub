import { defineStore } from 'pinia'

interface ILoadingStore {
  loadingCount: Ref<number>
  isLoading: ComputedRef<boolean>
  addLoading(): boolean
  removeLoading(): boolean
}

export const useLoadingStore = defineStore('Loading', (): ILoadingStore => {
  const loadingCount = ref<number>(0)
  const isLoading = computed<boolean>((): boolean => !!loadingCount.value)

  function addLoading (): boolean {
    loadingCount.value++
    return isLoading.value
  }

  function removeLoading (): boolean {
    const count = loadingCount.value - 1
    loadingCount.value = count < 0 ? 0 : count
    return isLoading.value
  }

  return {
    loadingCount,
    isLoading,
    addLoading,
    removeLoading
  }
})
