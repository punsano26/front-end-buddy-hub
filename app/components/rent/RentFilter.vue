<template>
  <div class="card flex justify-center">
    <SelectButton
      v-model="localCategoryId"
      :options="categoryOptions"
      option-label="label"
      option-value="value">
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <i :class="slotProps.option.icon" />
          <span>{{ slotProps.option.label }}</span>
        </div>
      </template>
    </SelectButton>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRentStore } from '~/stores/Rent'
import type { IFindAllRentCategoriesData } from '~/models/response/RentRes.model'

interface ICategoryOption {
  label: string
  value: number | undefined
  icon: string
}

const rentStore = useRentStore()

const localCategoryId = defineModel<number | undefined>('categoryId', { default: undefined })

const emit = defineEmits<{
  change: []
}>()

const categoryOptions = computed((): ICategoryOption[] => {
  const options: ICategoryOption[] = [{ label: 'ทั้งหมด', value: undefined, icon: 'pi pi-list' }]
  if (Array.isArray(rentStore.categories)) {
    rentStore.categories.forEach((cat: IFindAllRentCategoriesData): void => {
      let icon = 'pi pi-tag'
      if (cat.name.includes('สนุก')) icon = 'pi pi-comments'
      else if (cat.name.includes('ใจ')) icon = 'pi pi-heart'

      options.push({
        label: cat.name,
        value: cat.id,
        icon: icon
      })
    })
  }
  return options
})

watch(localCategoryId, (): void => {
  emit('change')
})
</script>
