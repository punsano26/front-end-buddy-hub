<template>
  <Card
    pt:root:class="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-2">
            <div class="relative">
              <img
                alt="Profile Image"
                class="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm dark:border-slate-800"
                src="/png/upload-profile.png">

              <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full dark:border-slate-900" />
            </div>

            <div class="flex flex-col leading-tight">
              <p class="font-semibold text-base text-slate-900 dark:text-white">
                John Doe
              </p>

              <p class="text-xs text-slate-500 dark:text-slate-400">
                <span>@johndoe</span> · 24 ปี
              </p>

              <div class="flex items-center gap-1 text-xs mt-1 text-slate-700 dark:text-slate-200">
                <i class="pi pi-star text-amber-400" />
                <span class="font-semibold">4.5</span>
                <span class="text-slate-400 dark:text-slate-500">(6 รีวิว · 361 เซสชัน)</span>
              </div>
            </div>
          </div>

          <Tag
            class="text-[8px] sm:text-xs md:text-xs whitespace-nowrap shrink-0"
            icon="pi pi-face-smile"
            severity="success"
            value="Emotional Support"
            rounded />
        </div>


        <p class="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
          พื้นที่ปลอดภัยสำหรับระบายความรู้สึก รับฟังโดยไม่ตัดสิน 🤍
        </p>


        <div class="flex flex-wrap gap-2">
          <Tag
            severity="secondary"
            value="ความรัก"
            rounded />
          <Tag
            severity="secondary"
            value="ความสัมพันธ์"
            rounded />
          <Tag
            severity="secondary"
            value="การเลิกรา"
            rounded />
        </div>


        <div class="flex flex-wrap gap-2">
          <Tag
            icon="pi pi-check"
            severity="success"
            value="Certified Listener"
            rounded />
          <Tag
            icon="pi pi-check"
            severity="success"
            value="Top Rated"
            rounded />
        </div>

        <Divider pt:root:class="p-horizontal:my-0 opacity-60 dark:opacity-30" />


        <div class="flex justify-between items-center">
          <div class="flex gap-4 text-sm">
            <p class="flex items-center gap-1 text-amber-500 font-semibold">
              <i class="pi pi-bitcoin" /> 100 /นาที
            </p>

            <p class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <i class="pi pi-clock" /> ~2 นาที
            </p>
          </div>

          <Button
            icon="pi pi-send"
            label="เช่าคุย"
            pt:label:class="font-semibold"
            pt:root:class="bg-gradient-primary border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
            size="small"
            rounded />
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
</script>

<style>

</style>
