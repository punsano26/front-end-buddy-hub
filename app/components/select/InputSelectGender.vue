<template>
  <SelectInput
    v-model="model"
    :items="UserGenderOptions"
    item-value="value"
    label="เพศ" />
</template>

<script setup lang="ts">
import { UserGenderOptions } from '@/models/enums/User.enum'
import SelectInput from '../select/SelectInput.vue'

const model = defineModel<string | undefined>({ required: true })
</script>

<style scoped>

</style>
