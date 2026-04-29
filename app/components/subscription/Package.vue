<template>
  <div
    class="group relative flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 text-slate-900 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:hover:bg-white/10">
    <div class="text-center">
      <p class="text-xs uppercase tracking-[0.28em] text-amber-700/80 dark:text-amber-200/80">
        {{ package.name }}
      </p>
      <p class="mt-2 text-3xl font-semibold">
        {{ package.price }} ฿
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-300">
        {{ package.smallDescription }}
      </p>
    </div>

    <div class="h-px w-full bg-slate-200/70 dark:bg-white/10" />

    <ul class="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
      <li
        v-for="(feature, index) in package.features"
        :key="index"
        class="flex gap-2">
        <span class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          <i class="pi pi-check text-[10px]" />
        </span>
        <span>{{ feature }}</span>
      </li>
    </ul>

    <button
      class="mt-auto w-full rounded-2xl border border-amber-400/60 bg-amber-200/70 px-4 py-2 text-sm font-semibold text-amber-800 transition duration-300 hover:border-amber-400 hover:bg-amber-300/70 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100 dark:hover:bg-amber-300/25"
      type="button">
      สมัคร {{ package.price }} ฿
    </button>
  </div>
</template>

<script lang="ts" setup>
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
