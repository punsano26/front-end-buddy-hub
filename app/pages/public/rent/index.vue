<template>
  <div
    class="flex flex-col gap-2 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
  >
    <h1 class="text-2xl font-bold sm:text-4xl">
      <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
        เช่าเพื่อนคุย
      </span>
    </h1>
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <p class="text-sm sm:max-w-2xl">
        เลือกเพื่อนคุยที่ใช่ — คุยเล่นสนุกๆ
        หรือปรึกษาปัญหาทางใจกับผู้รับฟังมืออาชีพ
      </p>
      <Button
      @click="isCreatePage"
        label="เปิดเช่ารับฟัง"
        icon="pi pi-plus"
        pt:root:class="bg-gradient-primary border-none px-4 py-2 shadow-sm hover:shadow-md hover:scale-105 transition"
        rounded
      />
    </div>
    <div class="grid grid-cols-1 gap-1 sm:grid-cols-[1fr_auto] sm:items-center">
      <InputSearch placeholder="ค้นหาชื่อ ความเชี่ยวชาญ..." class="w-full" />
      <SelectInput
        placeholder="เรตติ้งสูงสุด"
        pt:root:class="w-full sm:w-48 shadow-sm"
      />
    </div>
    <div class="flex justify-start">
      <RentFilter/>
    </div>

    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <RentCard />
      <RentCard />
      <RentCard />
      <RentCard />
      <RentCard />
      <RentCard />
      <RentCard />
    </div>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()

function isCreatePage (): void {
  router.push({ name: 'public-rent-create' })
}
</script>

<style></style>
