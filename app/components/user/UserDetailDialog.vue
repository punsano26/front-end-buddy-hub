<template>
  <Dialog
    v-model:visible="visible"
    :closable="true"
    :show-header="true"
    class="sm:w-100 w-9/10"
    pt:content:class="p-0"
    pt:header:class="!absolute !top-2 !right-2 !z-30 !p-0 !m-0 !bg-transparent !border-0 !shadow-none"
    pt:headerActions:class="!m-0 !p-0 !flex"
    pt:root:class="!relative bg-surface-900! border-none rounded-xl shadow-lg"
    pt:title:class="hidden"
    modal>
    <img
      alt="user banner"
      class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl"
      src="https://picsum.photos/seed/picsum/200/300">
    <div class="flex justify-center items-center gap-4 -mt-12 px-4">
      <img
        alt="user avatar"
        class="w-24 h-24 rounded-full border-4 border-surface-0"
        src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png">
    </div>
    <div class="flex flex-col items-center gap-2">
      <p class="text-xl text-white font-semibold">
        Sam Rivera
      </p>
      <p class="text-center mx-auto max-w-[280px] text-sm text-surface-500 dark:text-surface-400">
        Bookworm who also loves hiking. The best of both worlds!
      </p>
    </div>
    <div class="flex justify-center items-center gap-2 mt-2 p-4">
      <Button class="w-full bg-gradient-to-r from-sky-500 to-pink-600 border-none text-black! enabled:hover:from-sky-600 enabled:hover:to-pink-700 active:from-sky-400 active:to-pink-500">
        เพิ่มเพื่อน
      </Button>
      <Button class="w-full bg-gray-800! border-none enabled:hover:bg-gray-900">
        แชท
      </Button>
      <Button pt:root:class="w-full bg-transparent border-none text-red-500 enabled:hover:bg-red-500/10 enabled:hover:text-red-700 enabled:active:bg-red-500/20 active:text-red-700">
        รายงาน
      </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '~/volt/Dialog.vue'

const visible = ref(false)
</script>

<style scoped>

</style>
