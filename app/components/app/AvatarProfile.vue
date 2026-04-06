<template>
  <Button
    aria-controls="overlay_menu"
    aria-haspopup="true"
    pt:root:class="p-0 border-none bg-transparent"
    plain
    @click="toggle">
    <ClientOnly>
      <Avatar
        :image="authStore.user?.profileImg || '/png/upload-profile.png'"
        pt:image:class="object-cover"
        size="large" />
    </ClientOnly>
  </Button>
  <Menu
    id="overlay_menu"
    ref="menu"
    :model="items"
    :popup="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IMenuItem } from '~/models/Global.model'
import type { IAuthLoginData } from '~/models/response/AuthRes.model'
import Button from '~/volt/Button.vue'
import Menu from '~/volt/Menu.vue'

const authStore = useAuthStore()
const router = useRouter()


const menu = ref()

const userData = computed((): IAuthLoginData => {
  return {
    id: authStore.user.id,
    username: authStore.user.username,
    roles: authStore.user.roles,
    profileImg: authStore.user.profileImg
  }
})

const items = ref<IMenuItem[]>([
  {
    label: userData.value.username,
    icon: 'pi pi-user',
    command: goProfile
  },
  {
    label: 'logout',
    icon: 'pi pi-sign-out',
    command: onLogout
  }
])

function onLogout (): void {
  router.push({ name: 'auth-logout' })
}

function goProfile (): void {
  router.push({ name: 'public-profile' })
}
const toggle = (event: Event): void => {
  menu.value?.toggle(event)
}
</script>

<style scoped>

</style>
