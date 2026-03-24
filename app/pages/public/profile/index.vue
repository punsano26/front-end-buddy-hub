<template>
  <div class="flex justify-center items-center py-10 px-8">
    <Card pt:root:class="md:w-[600px]">
      <template #header>
        <img
          class="w-full h-32 object-cover rounded-tl-xl rounded-tr-xl"
          :src="items?.bannerImg || 'https://primefaces.org/cdn/primevue/images/profilebg.png'"
          alt="user banner"
        />
        <div class="flex gap-4 -mt-12 px-4">
          <img
            alt="user avatar"
            class="w-26 h-26 border-2 rounded-2xl"
            :src="items?.profileImg || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
          />
        </div>
      </template>
      <template #content>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex flex-col gap-2 ">
            <p class="text-xl font-bold">{{ items?.username }}</p>
            <p class="text-sm text-surface-500">
              {{ items?.description }}
            </p>
              <div class="flex gap-2 items-center">

                <p class="text-sm text-surface-500">Joined {{ items?.createdAt }}</p>
                <p class="text-sm text-surface-500">{{ items?.email }}</p>
                <p class="text-sm text-surface-500">{{ items?.gender }}</p>
                <p class="text-sm text-surface-500">{{ items?.dateOfBirth }}</p>
                <p class="text-sm text-surface-500">{{ items?.age }}</p>
              </div>
          </div>
          <div>
            <Button
              class="min-w-[110px] text-sm font-bold w-full"
              pt:root:class="border-none justify-center px-2 rounded-xl"
            >
              แก้ไขโปรไฟล์
            </Button>
          </div>
        </div>
      </template>
      <template #footer>
        <Divider />
        <div class="flex justify-center gap-24">
          <div class="flex flex-col">
            <p class="font-bold text-center">0</p>
            <p class="text-sm text-surface-500">เพื่อน</p>
          </div>
          <div class="flex flex-col">
            <p class="font-bold text-center">0</p>
            <p class="text-sm text-surface-500">แชท</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { IFindOneCurrentUserData } from '~/models/response/UserRes.model'
import UserProvider, { type IUserProvider } from '~/resource/provider/User.provider'

definePageMeta({ layout: "navbar" });

const userService: IUserProvider = new UserProvider()
const { $handleLoading } = useNuxtApp()
const items = ref<IFindOneCurrentUserData>()
async function useFetch (): Promise<void> {
const  response =  await userService.findOneCurrentUser()
  items.value = response?.data
}

function fetch (): void {
  $handleLoading(useFetch)
}

onMounted(() => {
  fetch()
})
</script>

<style scoped></style>
