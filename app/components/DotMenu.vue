
<template>
  <div class="flex justify-center card">
    <Button
      aria-controls="overlay_menu"
      aria-haspopup="true"
      class="!bg-transparent hover:!bg-transparent active:!bg-transparent !border-0 !shadow-none p-0"
      type="button"
      text
      @click="toggle">
      <template #icon>
        <img
          alt=""
          src="/svg/dot-menu.svg"
          style="width: 20px; height: 20px;">
      </template>
    </Button>
    <Menu
      id="overlay_menu"
      ref="menu"
      :model="items"
      :popup="true" />
  </div>
</template>

<script setup lang="ts">
import Button from '@/volt/Button.vue'
import Menu from '@/volt/Menu.vue'
import type { IItems } from '~/models/Global.model'

interface IProp {
  label?: string
  items?: IItems[]
}

const menu = ref()

withDefaults(defineProps<IProp>(), {
  label: '',
  items: (): IItems[] => []
})

const toggle = (event: any): void => {
  menu.value.toggle(event)
}
</script>
