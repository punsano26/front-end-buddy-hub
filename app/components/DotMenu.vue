
<template>
  <div class="flex justify-center card">
    <Button
      aria-controls="overlay_menu"
      aria-haspopup="true"
      class="!bg-transparent hover:!bg-transparent active:!bg-transparent !border-0 !shadow-none p-0"
      type="button"
      text
      @click="toggle"
      @touchend="onTouchEnd"
      @touchmove="onTouchEnd"
      @touchstart="onTouchStart">
      <template #icon>
        <i class="pi pi-ellipsis-v text-gray-500 dark:text-white text-xs md:text-md" />
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
  icon?: string
  label?: string
  items?: IItems[]
}

const menu = ref()
const longPressTimer = ref<ReturnType<typeof setTimeout> | null>(null)

withDefaults(defineProps<IProp>(), {
  label: '',
  items: (): IItems[] => []
})

const toggle = (event: any): void => {
  menu.value.toggle(event)
}

function onTouchStart (event: TouchEvent): void {
  longPressTimer.value = setTimeout((): void => {
    if (menu.value) {
      menu.value.show(event)
    }
  }, 500)
}

function onTouchEnd (): void {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}
</script>
