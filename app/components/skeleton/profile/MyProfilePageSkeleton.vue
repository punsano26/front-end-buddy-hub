<template>
  <Card pt:root:class="md:w-[600px] w-full">
    <template #header>
      <div class="relative mb-10 mt-2 mx-2">
        <!-- Banner Skeleton -->
        <Skeleton
          height="180px"
          pt:root:class="rounded-xl"
          width="100%" />
        <!-- Avatar Skeleton -->
        <div class="absolute -bottom-10 left-6 border-4 border-surface-0 dark:border-surface-950 rounded-full bg-surface-0 dark:bg-surface-950">
          <Skeleton
            shape="circle"
            size="6rem" />
        </div>
      </div>
    </template>

    <template #content>
      <div class="flex flex-col md:flex-row gap-4 px-2">
        <div class="flex flex-col gap-3 w-full">
          <!-- Username & Nickname -->
          <Skeleton
            height="1.75rem"
            width="60%" />
          <!-- Description -->
          <Skeleton
            height="1rem"
            width="90%" />
          <Skeleton
            height="1rem"
            width="50%" />

          <!-- Detail Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 mt-6">
            <div
              v-for="i in 5"
              :key="`detail-skeleton-${i}`"
              class="flex gap-2 items-center">
              <Skeleton
                class="shrink-0"
                shape="circle"
                size="1.25rem" />
              <Skeleton
                height="1rem"
                width="80%" />
            </div>
          </div>
        </div>

        <!-- Edit Profile Button -->
        <div class="mt-4 md:mt-0 flex justify-end md:justify-start">
          <Skeleton
            border-radius="0.75rem"
            height="2.5rem"
            width="110px" />
        </div>
      </div>
    </template>

    <template #footer>
      <Divider />
      <div class="flex justify-center gap-24 py-2">
        <div class="flex flex-col items-center gap-2">
          <Skeleton
            height="1.5rem"
            width="1.5rem" />
          <Skeleton
            height="1rem"
            width="3rem" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <Skeleton
            height="1.5rem"
            width="1.5rem" />
          <Skeleton
            height="1rem"
            width="3rem" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/volt/Card.vue'
import Divider from '~/volt/Divider.vue'
</script>

<style scoped></style>
