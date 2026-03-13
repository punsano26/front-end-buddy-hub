<template>
  <div class="relative w-full p-2">
    <Icon
      class="left-4 absolute top-1/2 -mt-2.5 text-surface-400 leading-none z-1"
      name="system-uicons:search"
      size="21" />
    <InputText
      v-model="model"
      class=" border-0 border-b rounded-xl shadow-none focus:shadow-input"
      placeholder="ค้นหาเพื่อนใหม่"
      pt:root="ps-8 bg-gray-800 text-gray-100 placeholder:text-gray-300 focus:text-white focus:placeholder:text-gray-200"
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
