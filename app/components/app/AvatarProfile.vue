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
    roles: authStore.user.roles,
    profileImg: authStore.user.profileImg
  }
})

const items = ref<IMenuItem[]>([
  {
    label: `${userData.value.id}`,
    items: [
      {
        label: 'logout',
        icon: 'pi pi-refresh',
        command: onLogout
      }
    ]
  }
])

function onLogout (): void {
  router.push({ name: 'auth-logout' })
}
const toggle = (event: Event): void => {
  menu.value?.toggle(event)
}
</script>

<style scoped>

</style>
