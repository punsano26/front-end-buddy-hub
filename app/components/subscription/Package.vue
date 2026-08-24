<template>
  <div
    class="group relative flex h-full flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 text-slate-900 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-white dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:hover:bg-white/10">
    <div class="text-center">
      <p class="text-xs uppercase tracking-[0.28em] text-amber-700/80 dark:text-amber-200/80">
        {{ packageItem.name }}
      </p>
      <p class="mt-2 text-3xl font-semibold">
        {{ packageItem.coinPrice ? `${packageItem.coinPrice} เหรียญ` : `${packageItem.price} ฿` }}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-300">
        {{ packageItem.smallDescription || packageItem.description }}
      </p>
    </div>

    <div class="h-px w-full bg-slate-200/70 dark:bg-white/10" />

    <ul class="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
      <li
        v-for="(feature, index) in (packageItem.features || defaultFeatures)"
        :key="index"
        class="flex gap-2">
        <span class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          <i class="pi pi-check text-[10px]" />
        </span>
        <span>{{ feature }}</span>
      </li>
    </ul>

    <button
      class="mt-auto w-full rounded-2xl border border-amber-400/60 bg-amber-200/70 px-4 py-2 text-sm font-semibold text-amber-800 transition duration-300 hover:border-amber-400 hover:bg-amber-300/70 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100 dark:hover:bg-amber-300/25 cursor-pointer"
      type="button"
      @click="handleSubscribe">
      สมัคร {{ packageItem.coinPrice ? `${packageItem.coinPrice} เหรียญ` : `${packageItem.price} ฿` }}
    </button>
  </div>
</template>

<script lang="ts" setup>
interface Package {
  id?: number
  name: string
  price?: number
  coinPrice?: number
  smallDescription?: string
  description?: string | null
  features?: string[]
}

const props = defineProps<{
  package: Package
}>()

const packageItem = computed((): Package => props.package)

const defaultFeatures = [
  'Find Match 50 ครั้ง/วัน',
  'VIP Badge สีทอง',
  'โปรไฟล์ติดอันดับต้น',
  'ไม่มีโฆษณา'
]

const emit = defineEmits<{
  (e: 'select', pkg: Package): void
}>()

function handleSubscribe (): void {
  emit('select', props.package)
}
</script>
