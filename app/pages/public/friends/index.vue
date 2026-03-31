<template>
  <div class="py-8 px-4">
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div class="flex gap-4 items-center">
          <Button
          size="medium"
          pt:root:class="bg-gradient-primary border-none rounded-xl py-3">
          <i class="pi pi-user-plus" />
        </Button>
        <h2 class="text-lg font-bold">เพื่อนๆ</h2>
        <p class="text-sm text-gray-300">({{ itemsUserFriends.length }})</p>
        </div>
        <div class="w-full sm:w-auto">
          <InputSearch/>
        </div>
      </div>
      <!-- User List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
      <UserCardListFriends  
        v-for="(item, index) in itemsUserFriends"
        :key="index"
        :value="item"
      />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputSearch from '~/components/input/InputSearch.vue'

definePageMeta({ layout: "navbar" });

const itemsUserFriends = ref<any[]>([
  {
    id: 1,
    imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    username: 'น้องใหม่',
    description: 'เพิ่งเข้ามาใหม่ๆ ยังไม่มีอะไรเลย'
  },
  {
    id: 2,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6D_mVwn1iQvRHsHN3YkN7H3llkUKKaxV7MO-WBNzsuA&s',
    username: 'เพื่อนเก่า',
    description: 'เป็นเพื่อนกันมานานแล้ว'
  },
  {
    id: 3,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMSNNWXH68XyeW2OcHhSYKi4QoZxBCoLqGMPPkfckW9g&s',
    username: 'เพื่อนสนิท',
    description: 'เป็นเพื่อนที่สนิทมากๆ'
  },
  {
    id: 4,
    imageUrl: 'https://wallpaperaccess.com/full/4595683.jpg',
    username: 'เพื่อนร่วมงาน',
    description: 'เป็นเพื่อนที่ทำงานด้วยกัน'
  }
])
</script>

<style scoped>

</style>