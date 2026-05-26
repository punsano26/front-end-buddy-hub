<template>
  <div class="relative w-full p-2">
    <Icon
      class="left-4 absolute top-1/2 -mt-2.5 text-slate-500 dark:text-slate-400 leading-none z-1"
      name="system-uicons:search"
      size="21" />
    <InputText
      v-model="model"
      :placeholder="placeholder || 'ค้นหาเพื่อนใหม่'"
      class="border-0 border-b border-slate-300 dark:border-slate-800 focus:border-primary rounded-xl shadow-none transition-all duration-200"
      pt:root="ps-8 bg-slate-200 text-slate-800 placeholder:text-slate-500 focus:bg-slate-100 focus:text-slate-900 focus:placeholder:text-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:bg-slate-950 dark:focus:text-white dark:focus:placeholder:text-slate-300 transition-all duration-200"
      variant="outlined"
      fluid
      @blur="debounceSearch.flush()"
      @keypress.enter="debounceSearch.flush()" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounce } from '@/utils/UseDebounce'

interface IEmits {
  search: [searchValue: string]
}

const model = defineModel<string>({ default: '' })
const emits = defineEmits<IEmits>()

const route = useRoute()
const router = useRouter()

defineProps<{
  placeholder?: string
}>()

function emitSearch (): void {
  router.replace({
    query: {
      ...route.query,
      search: model.value
    }
  })
  emits('search', model.value)
}
const debounceSearch = useDebounce(emitSearch)
watch(model, (): void => {
  debounceSearch()
})
onMounted((): void => {
  model.value = route.query?.search as string || ''
})
</script>

<style scoped>

</style>
