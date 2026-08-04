<template>
  <div class="flex items-center justify-center min-h-screen">
    <ProgressSpinner />
  </div>
</template>

<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

definePageMeta({
  redirect: (to: any): any => {
    return {
      name: 'auth-login',
      query: to.query
    }
  }
})
</script>
