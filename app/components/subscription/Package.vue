<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-2 justify-center items-center">
        <p>{{ package.name }}</p>
        <div class="flex flex-col items-center">
          <p class="text-2xl font-bold">
            {{ package.price }} ฿
          </p>
          <p class="text-xs">
            {{ package.smallDescription }}
          </p>
        </div>
        <Divider />
        <div class="flex flex-col gap-2">
          <div
            v-for="(feature, index) in package.features"
            :key="index"
            class="flex gap-2 items-center">
            <i class="pi pi-check-circle text-green-500" />
            <span class="text-sm">{{ feature }}</span>
          </div>
        </div>
        <Button
          :label="`สมัคร ${package.price} ฿`"
          class="w-full"
          severity="primary"
          size="small" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import Divider from '~/volt/Divider.vue'

defineProps<{
  package: {
    name: string
    price: number
    smallDescription: string
    features: string[]
  }
}>()
</script>

<style>

</style>
