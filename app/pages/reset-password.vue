<template>
  <div class="flex items-center justify-center min-h-screen">
    <i class="pi pi-spin pi-spinner text-4xl text-primary" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

definePageMeta({
  redirect: (to: any): any => {
    return {
      name: 'auth-reset-forgot-password',
      query: to.query
    }
  }
})

onBeforeMount((): void => {
  router.replace({
    name: 'auth-reset-forgot-password',
    query: route.query
  })
})
</script>

<style scoped>
</style>
