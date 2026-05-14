<template>
  <div v-if="route.name === 'auth-logout'">
    <NuxtPage />
  </div>

  <Card
    v-else
    class="w-full max-w-[446.68px] border-none border-(--p-gray-5) rounded-[28px] shadow-none"
    pt:body:class="px-[30px] py-10"
    pt:content:class="
      flex flex-col items-center gap-4
      [&>div]:w-full [&>div]:flex [&>div]:flex-col [&>div]:gap-4
      [&>form]:w-full [&>form]:flex [&>form]:flex-col [&>form]:gap-4
    ">
    <template #content>
      <div v-if="route.meta?.backPath">
        <ButtonBack
          :to="route.meta?.backPath"
          icon="prime:chevron-left" />
      </div>
      <img
        alt="Buddy Hub Logo"
        height="90"
        src="/png/logo-buddy-hub.png"
        width="90">
      <h6 class="font-bold text-[32px]">
        {{ route.meta?.title || '-' }}
      </h6>

      <p
        v-if="route.meta?.description"
        class="text-gray-400">
        {{ route.meta?.description }}
      </p>
      <NuxtPage />
    </template>
  </Card>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const route = useRoute()
</script>

<style scoped>

</style>
