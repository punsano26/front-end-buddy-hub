<template>
  <Button
    aria-controls="overlay_menu"
    aria-haspopup="true"
    pt:root:class="p-0 border-none bg-transparent"
    plain
    @click="toggle">
    <Avatar
      icon="pi pi-user"
      image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
      size="large" />
  </Button>
  <Menu
    id="overlay_menu"
    ref="menu"
    :model="items"
    :popup="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '~/volt/Button.vue'
import Menu from '~/volt/Menu.vue'

interface IMenuItem {
  label?: string
  icon?: string
  items?: IMenuItem[]
}

const menu = ref()
const items = ref<IMenuItem[]>([
  {
    label: `username`,
    items: [
      {
        label: 'logout',
        icon: 'pi pi-refresh'
      }
    ]
  }
])

const toggle = (event: Event): void => {
  menu.value?.toggle(event)
}
</script>

<style scoped>

</style>
