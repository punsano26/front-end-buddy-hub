<template>
  <div>
    <Toolbar pt:root="p-2 border-none rounded-none">
      <template #start>
        <Button
          class="md:hidden"
          text
          @click="menuOpen = !menuOpen">
          <template #icon>
            <img
              alt="cancel"
              class="w-4 h-4"
              src="/svg/flowbite--bars-outline.svg">
          </template>
        </Button>
        <div class="flex items-center gap-2">
          <img
            alt="Buddy Hub logo"
            class="w-12 ms-4"
            src="/png/logo-buddy-hub.png">
        </div>
      </template>

      <template #center>
        <!-- Desktop nav: hidden on mobile -->
        <div class="hidden md:flex space-x-6">
          <NuxtLink :to="{ name: 'public-home' }">
            <SecondaryButton
              :class="isActivePage('public-home') ? 'bg-gradient-primary !text-surface-900 rounded-xl' : ''"
              label="Home"
              pt:root:class="py-1"
              text />
          </NuxtLink>
          <NuxtLink :to="{ name: 'public-chat' }">
            <SecondaryButton
              :class="isActivePage('public-chat') ? 'bg-gradient-primary !text-surface-900 rounded-xl' : ''"
              label="Chats"
              pt:root:class="py-1"
              text />
          </NuxtLink>
          <SecondaryButton
            label="Friends"
            pt:root:class="py-1"
            text />
          <NuxtLink :to="{ name: 'public-profile' }">
            <SecondaryButton
              :class="isActivePage('public-profile') ? 'bg-gradient-primary !text-surface-900 rounded-xl' : ''"
              label="Profile"
              pt:root:class="py-1"
              text />
          </NuxtLink>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <img
            alt="Notifications"
            class="w-6 h-6"
            src="/svg/mdi-light--bell.svg">
          <AvatarProfile v-if="authStore.user.id" />
          <NuxtLink
            v-else
            :to="{ name: 'auth-verify' }">
            <Button
              label="Login"
              text />
          </NuxtLink>
        </div>
      </template>
    </Toolbar>

    <!-- Mobile dropdown menu -->
    <div
      v-if="menuOpen"
      class="md:hidden flex flex-col bg-surface-900 px-4 pb-4 space-y-1">
      <SecondaryButton
        class="justify-start w-full"
        label="Home"
        text
        @click="menuOpen = false" />
      <SecondaryButton
        class="justify-start w-full"
        label="Chats"
        text
        @click="menuOpen = false" />
      <SecondaryButton
        class="justify-start w-full"
        label="Friends"
        text
        @click="menuOpen = false" />
      <SecondaryButton
        class="justify-start w-full"
        label="Profile"
        text
        @click="menuOpen = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AvatarProfile from './AvatarProfile.vue'
import Button from '~/volt/Button.vue'
import SecondaryButton from '~/volt/SecondaryButton.vue'
import Toolbar from '~/volt/Toolbar.vue'

const authStore = useAuthStore()

const menuOpen = ref(false)

const isActivePage = (pageName: string): boolean => {
  return useRoute().name === pageName
}
</script>
