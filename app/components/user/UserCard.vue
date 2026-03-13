<template>
  <Card
    class="w-full"
    pt:body:class="p-2 bg-slate-800 text-white rounded-lg border-none">
    <template #content>
      <div class="flex flex-col justify-center items-center">
        <div class="mb-1">
          <OverlayBadge>
            <Avatar
              icon="pi pi-user"
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              size="xlarge" />
          </OverlayBadge>
        </div>
        <p class="text-xs">
          User Name
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Avatar from '~/volt/Avatar.vue'
import OverlayBadge from '~/volt/OverlayBadge.vue'
</script>

<style scoped>

</style>
