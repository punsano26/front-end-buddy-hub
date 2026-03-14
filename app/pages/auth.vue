<template>
  <Card
    class="w-full max-w-[446.68px] border-none border-(--p-gray-5) rounded-[28px] shadow-none"
    pt:body:class="px-[42px] py-10"
    pt:content:class="
      flex flex-col items-center gap-4
      [&>div]:w-full [&>div]:flex [&>div]:flex-col [&>div]:gap-6
      [&>form]:w-full [&>form]:flex [&>form]:flex-col [&>form]:gap-6
    ">
    <template #content>
      <div v-if="route.meta?.backPath">
        <ButtonBack :to="route.meta?.backPath" />
      </div>
      <img
        alt="Buddy Hub Logo"
        height="90"
        src="/png/logo-buddy-hub.png"
        width="90">
      <h6 class="text-primary font-bold text-[32px]">
        {{ route.meta?.title || '-' }}
      </h6>

      <p>
        {{ route.meta?.description || '-' }}
      </p>
      <NuxtPage />
    </template>
  </Card>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
</script>

<style scoped>

</style>
