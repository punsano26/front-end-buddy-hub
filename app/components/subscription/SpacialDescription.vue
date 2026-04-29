<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <div
      v-for="(spacialDescription, index) in spacialDescriptions"
      :key="index">
      <Card pt:root:class="rounded-3xl">
        <template #content>
          <div class="flex gap-2 items-center">
            <i :class="`pi ${spacialDescription.icon}`" />
            <div class="flex flex-col gap-1">
              <p>{{ spacialDescription.title }}</p>
              <p class="text-sm text-gray-500">
                {{ spacialDescription.description }}
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  spacialDescriptions: {
    icon: string
    title: string
    description: string
  }[]
}>()
</script>

<style scoped>

</style>
