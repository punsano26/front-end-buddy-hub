<template>
  <Card>
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img
            :src="props.value.imageUrl"
            alt="Avatar-friends"
            class="h-12 w-12 rounded-md object-cover">
          <div class="flex flex-col">
            <h3 class="text-lg font-bold">
              {{ props.value.username }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ props.value.description }}
            </p>
          </div>
        </div>
        <div>
          <Button
            label="ข้อความ"
            pt:root:class="bg-gradient-primary border-none rounded-xl py-3"
            size="small" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
  value: {
    id: number
    description: string
    username: string
    imageUrl: string
  }
}>()
</script>

<style scoped>

</style>
