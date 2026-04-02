<template>
  <div>
    <Toolbar
      pt:root="px-2 md:px-2 py-2 border-none bg-white/70 dark:bg-surface-900/70 backdrop-blur-xl shadow-sm">
      <template #start>
        <div class="flex items-center justify-start w-20 md:w-auto gap-2">
          <!-- Mobile menu -->
          <Button
            class="inline-flex md:hidden"
            text
            @click="menuOpen = !menuOpen">
            <template #icon>
              <img
                class="w-5 h-5 opacity-80"
                src="/svg/flowbite--bars-outline.svg">
            </template>
          </Button>

          <NuxtLink :to="{ name: 'public-home' }">
            <img
              class="w-9 md:w-12 transition-transform duration-200 hover:scale-105"
              src="/png/logo-buddy-hub.png">
          </NuxtLink>
        </div>
      </template>


      <template #center>
        <div class="flex items-center justify-center gap-8 md:gap-4 md:bg-white/40 md:dark:bg-surface-800/40 md:backdrop-blur-lg px-1.5 md:px-2 py-1 rounded-2xl shadow-inner">
          <NuxtLink :to="{ name: 'public-home' }">
            <SecondaryButton
              :class="navClass('public-home')"
              icon="pi pi-home"
              label="Home"
              pt:label:class="hidden md:inline"
              pt:root:class="h-8 w-8 p-0 gap-0 rounded-xl md:h-auto md:w-auto md:px-3 md:py-1.5 md:gap-2 md:text-sm transition-all duration-200 hover:bg-white/60 dark:hover:bg-surface-700/60"
              text />
          </NuxtLink>

          <NuxtLink :to="{ name: 'public-chat' }">
            <SecondaryButton
              :class="navClass('public-chat')"
              icon="pi pi-comment"
              label="Chats"
              pt:label:class="hidden md:inline"
              pt:root:class="h-8 w-8 p-0 gap-0 rounded-xl md:h-auto md:w-auto md:px-3 md:py-1.5 md:gap-2 md:text-sm transition-all duration-200 hover:bg-white/60 dark:hover:bg-surface-700/60"
              text />
          </NuxtLink>

          <NuxtLink :to="{ name: 'public-friends' }">
            <SecondaryButton
              :class="navClass('public-friends')"
              icon="pi pi-users"
              label="Friends"
              pt:label:class="hidden md:inline"
              pt:root:class="h-8 w-8 p-0 gap-0 rounded-xl md:h-auto md:w-auto md:px-3 md:py-1.5 md:gap-2 md:text-sm transition-all duration-200 hover:bg-white/60 dark:hover:bg-surface-700/60"
              text />
          </NuxtLink>

          <NuxtLink
            :to="{ name: 'public-profile' }"
            class="hidden md:inline-flex">
            <SecondaryButton
              :class="navClass('public-profile')"
              icon="pi pi-user"
              label="Profile"
              pt:label:class="hidden md:inline"
              pt:root:class="h-8 w-8 p-0 gap-0 rounded-xl md:h-auto md:w-auto md:px-3 md:py-1.5 md:gap-2 md:text-sm transition-all duration-200 hover:bg-white/60 dark:hover:bg-surface-700/60"
              text />
          </NuxtLink>
        </div>
      </template>


      <template #end>
        <div class="flex items-center justify-end w-12 h-12 md:w-auto gap-2 md:gap-3">
          <img
            class="hidden md:block opacity-80 hover:scale-110 transition"
            src="/svg/mdi-light--bell.svg">

          <AvatarProfile v-if="authStore.user.id" />

          <NuxtLink
            v-else
            :to="{ name: 'auth-verify' }">
            <Button
              class="hidden md:inline-flex text-sm"
              icon="pi pi-sign-in"
              icon-pos="right"
              label="Login"
              text />

          </NuxtLink>
        </div>
      </template>
    </Toolbar>

    <Transition
      enter-active-class="transition-opacity duration-250 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <button
        v-if="menuOpen"
        aria-label="Close sidebar"
        class="fixed inset-0 z-40 bg-black/40 md:hidden"
        @click="menuOpen = false" />
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition-all duration-220 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="-translate-x-full opacity-0">
      <aside
        v-if="menuOpen"
        class="fixed top-0 left-0 z-50 h-full w-72 md:hidden bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 shadow-2xl">
        <div class="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-700">
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">Menu</span>
          <Button
            aria-label="Close menu"
            icon="pi pi-times"
            text
            @click="menuOpen = false" />
        </div>

        <nav class="px-3 py-3 space-y-1">
          <NuxtLink
            :to="{ name: 'public-home' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-home')"
              class="justify-start w-full"
              icon="pi pi-home"
              label="Home"
              pt:root:class="w-full justify-start"
              text />
          </NuxtLink>

          <NuxtLink
            :to="{ name: 'public-chat' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-chat')"
              class="justify-start w-full"
              icon="pi pi-comment"
              label="Chats"
              pt:root:class="w-full justify-start"
              text />
          </NuxtLink>

          <NuxtLink
            :to="{ name: 'public-friends' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-friends')"
              class="justify-start w-full"
              icon="pi pi-users"
              label="Friends"
              pt:root:class="w-full justify-start"
              text />
          </NuxtLink>

          <NuxtLink
            :to="{ name: 'public-profile' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-profile')"
              class="justify-start w-full"
              icon="pi pi-user"
              label="Profile"
              pt:root:class="w-full justify-start"
              text />
          </NuxtLink>
        </nav>
      </aside>
    </Transition>
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

const route = useRoute()

const navClass = (page: string): string => {
  return route.name === page
    ? 'bg-gradient-primary dark:text-black! text-back! shadow-md'
    : 'text-surface-600 dark:text-surface-300'
}

const drawerNavClass = (page: string): string => {
  return route.name === page
    ? 'bg-gradient-primary  dark:text-black! text-back!  shadow-sm'
    : 'text-surface-600 dark:text-surface-300'
}
</script>
