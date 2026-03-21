<template>
  <div class="flex justify-center items-center py-10 px-8">
    <Card pt:root:class="md:w-[600px]">
      <template #header>
        <img
          class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl"
          src="https://picsum.photos/seed/picsum/200/300"
          alt=""
        />
        <div class="flex gap-4 -mt-12 px-4">
          <img
            alt="user avatar"
            class="w-26 h-26 border-2 rounded-2xl"
            src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-2 ">
            <p class="text-xl font-bold">username</p>
            <p class="text-sm text-surface-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
              voluptate.
            </p>
            <p>Joined Jan 2025</p>
          </div>
          <div>
            <Button
              class="min-w-[110px] text-sm font-bold w-full"
              pt:root:class="border-none justify-center px-2 rounded-xl"
            >
              แก้ไขโปรไฟล์
            </Button>
          </div>
        </div>
      </template>
      <template #footer>
        <Divider />
        <div class="flex justify-center gap-24">
          <div class="flex flex-col">
            <p class="font-bold text-center">0</p>
            <p class="text-sm text-surface-500">เพื่อน</p>
          </div>
          <div class="flex flex-col">
            <p class="font-bold text-center">0</p>
            <p class="text-sm text-surface-500">แชท</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "navbar" });
</script>

<style scoped></style>
