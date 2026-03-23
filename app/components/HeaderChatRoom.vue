<template>
  <Card pt:root:class="w-full rounded-none">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <ButtonBack
            :to="{ name: 'public-chat' }"
            icon="mdi:arrow-left" />
          <img
            alt="Alice"
            class="w-10 h-10 rounded-sm object-cover"
            src="/png/upload-profile.png">
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate">
              Alice Johnson
            </p>
            <p class="text-sm text-gray-500 truncate">
              Online
            </p>
          </div>
        </div>
        <DotMenu />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">


</script>

<style scoped>

</style>
