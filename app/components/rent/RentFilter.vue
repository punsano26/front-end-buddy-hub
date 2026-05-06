<template>
  <div class="card flex justify-center">
    <SelectButton
      v-model="value"
      :options="options"
      option-label="label">
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
import { ref } from 'vue'

const value = ref('ทั้งหมด')

const options = ref([
  { label: 'ทั้งหมด', icon: 'pi pi-list' },
  { label: 'คุยสนุก', icon: 'pi pi-comments' },
  { label: 'ปรึกษาทางใจ', icon: 'pi pi-user' }
])
</script>
