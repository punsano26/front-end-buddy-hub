<template>
  <Card
    class="w-full"
    pt:body:class="p-2 bg-slate-800 text-white rounded-lg border-none">
    <template #content>
      <div class="flex flex-col justify-center items-center">
        <div class="mb-1">
          <Skeleton
            border-radius="16px"
            size="4rem" />
        </div>

        <Skeleton
          class="mt-1"
          height="1rem"
          width="4rem" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/volt/Card.vue'
</script>

<style scoped>
</style>
