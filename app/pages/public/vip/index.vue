<template>
  <section class="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div class="pointer-events-none absolute -top-28 right-[-10%] h-80 w-80 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-400/20" />
    <div class="pointer-events-none absolute bottom-[-25%] left-[-10%] h-96 w-96 rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-400/20" />

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-3 rounded-full border border-amber-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm backdrop-blur dark:border-amber-400/30 dark:bg-white/5 dark:text-amber-200">
            <i class="pi pi-crown text-amber-500" />
            VIP Experience
          </div>

          <div class="space-y-4">
            <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
              BuddyHub VIP
            </h1>
            <p class="text-base text-slate-600 dark:text-slate-300">
              ปลดล็อกประสบการณ์เต็มรูปแบบ — Find Match ได้มากขึ้น
              <span class="font-semibold text-amber-600 dark:text-amber-300">10 เท่า</span>
              และโดดเด่นกว่าใคร
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <p class="text-xs uppercase text-slate-400 dark:text-slate-400">Find Match</p>
              <p class="text-lg font-semibold">50 ครั้ง/วัน</p>
            </div>
            <div class="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <p class="text-xs uppercase text-slate-400 dark:text-slate-400">Badge</p>
              <p class="text-lg font-semibold">VIP สีทอง</p>
            </div>
            <div class="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <p class="text-xs uppercase text-slate-400 dark:text-slate-400">Boost</p>
              <p class="text-lg font-semibold">Top Profile</p>
            </div>
          </div>
        </div>

        <div class="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">สถานะของคุณ</p>
          <StatusPackage />
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xl font-semibold">เลือกแพ็คเกจ VIP</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">ชำระครั้งเดียว ไม่มีต่ออัตโนมัติ</p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="relative">
            <span class="absolute -top-3 left-4 z-10 rounded-full border border-amber-200/80 bg-amber-100/90 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm dark:border-amber-400/40 dark:bg-amber-400/20 dark:text-amber-200">
              ลองก่อน
            </span>
            <Package :package="vipPackage1" />
          </div>

          <div class="relative">
            <span class="absolute -top-3 left-4 z-10 rounded-full border border-rose-200/20 bg-rose-100/90 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm dark:border-rose-500 dark:bg-rose-400/90 dark:text-rose-900/80">
              คุ้มสุด
            </span>
            <div class="rounded-3xl ring-2 ring-amber-400/60 dark:ring-amber-400/50">
              <Package :package="vipPackage2" />
            </div>
          </div>

          <div class="relative">
            <span class="absolute -top-3 left-4 z-10 rounded-full border border-sky-200/80 bg-sky-100/90 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm dark:border-sky-400/40 dark:bg-sky-400/20 dark:text-sky-200">
              ประหยัดสุด
            </span>
            <Package :package="vipPackage3" />
          </div>
        </div>
      </div>

      <div class="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-lg font-semibold">สิทธิพิเศษสำหรับสมาชิก VIP</p>
          <span class="rounded-full border border-amber-200/70 bg-amber-100/70 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
            สำหรับสมาชิก VIP เท่านั้น
          </span>
        </div>
        <SpacialDescription :spacial-descriptions="spacialDescriptions" />
      </div>

      <div class="rounded-2xl border border-blue-200/70 bg-blue-50/80 p-4 text-sm text-blue-900/80 shadow-sm dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-100">
        <div class="flex gap-3 items-start">
          <i class="pi pi-wave-pulse text-blue-500 text-lg mt-0.5" />
          <p>
            VIP ต่ออายุไม่อัตโนมัติ — ระบบจะเตือนก่อนหมดอายุ ·
            สามารถยกเลิกได้ทุกเมื่อ ·
            ยอดที่ชำระไม่สามารถขอคืนได้หลังเริ่มใช้งานแล้ว
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import Package from '~/components/subscription/Package.vue'
import SpacialDescription from '~/components/subscription/SpacialDescription.vue'
import StatusPackage from '~/components/subscription/StatusPackage.vue'

definePageMeta({ layout: "navbar" });
const vipPackage1 = ref({
  name: 'VIP รายวัน',
  price: 15,
  smallDescription: 'ใช้งาน 1 วัน · ≈ ฿15.00/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const vipPackage2 = ref({
  name: 'VIP รายสัปดาห์',
  price: 39,
  smallDescription: 'ใช้งาน 7 วัน · ≈ ฿5.57/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const vipPackage3 = ref({
  name: 'VIP รายเดือน',
  price: 99,
  smallDescription: 'ใช้งาน 30 วัน · ≈ ฿3.30/วัน',
  features: [
    'Find Match 50 ครั้ง/วัน',
    'VIP Badge สีทอง',
    'โปรไฟล์ติดอันดับต้น',
    'ไม่มีโฆษณา'
  ]
})

const spacialDescriptions = ref([
  {
    icon: 'pi-bolt',
    title: 'ใช้ Find Match ได้ 50 ครั้ง/วัน',
    description: 'ฟรีจำกัดแค่ 5 ครั้ง/วัน'
  },
  {
    icon: 'pi-crown',
    title: 'VIP Badge สีทอง',
    description: 'เด่นในทุกโปรไฟล์และห้องแชท'
  },
  {
    icon: 'pi-heart',
    title: 'Match ติดอันดับต้น',
    description: 'โปรไฟล์ของคุณถูกเสนอให้คนอื่นเห็นมากขึ้น'
  },
  {
    icon: 'pi-images',
    title: 'ตั้ง Avatar & Banner เป็น GIF',
    description: 'เฉพาะสมาชิก VIP เท่านั้น (ฟรีใช้ได้แค่ภาพนิ่ง)'
  },
  {
    icon: 'pi-objects-column',
    title: 'ไม่มีโฆษณา',
    description: 'ใช้งานลื่นไหลแบบไม่มีรบกวน'
  }
])
</script>

<style scoped>

</style>