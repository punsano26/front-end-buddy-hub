<template>
  <div class="min-h-screen flex items-center justify-center">
    <i class="pi pi-spin pi-spinner text-4xl text-primary" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

onBeforeMount((): void => {
  router.replace({
    name: 'auth-verify-email',
    query: route.query
  })
})
</script>

<style scoped>
</style>
