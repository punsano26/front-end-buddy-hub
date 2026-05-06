<template>
  <div>
    <div class="flex justify-self-start px-4 pt-4 sm:px-6 lg:px-12">
      <div class="mx-auto w-full max-w-4xl">
        <ButtonBack
          v-if="route.meta?.backPath"
          :to="route.meta?.backPath"
          icon="prime:chevron-left"
          label="ย้อนกลับ"
          preserve-query />
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
</script>

<style>

</style>
