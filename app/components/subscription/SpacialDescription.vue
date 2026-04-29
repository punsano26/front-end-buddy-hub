<template>
  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
    <div
      v-for="(spacialDescription, index) in spacialDescriptions"
      :key="index"
      class="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-[0_18px_40px_rgba(15,23,42,0.35)]">
      <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200">
        <i :class="`pi ${spacialDescription.icon}`" />
      </span>
      <div class="flex flex-col gap-1">
        <p class="font-semibold">
          {{ spacialDescription.title }}
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-300">
          {{ spacialDescription.description }}
        </p>
      </div>
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
