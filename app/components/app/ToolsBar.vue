<template>
  <div class="relative">
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-[radial-gradient(closest-side,rgba(59,130,246,0.25),transparent)] dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.2),transparent)]" />

    <Toolbar
      class="isolate"
      pt:root="sticky top-0 z-50 w-full px-3 md:px-6 py-2.5 md:py-3 border-b border-surface-200/70 dark:border-surface-800/70 bg-white/80 dark:bg-surface-900/75 backdrop-blur-xl shadow-[0_12px_40px_-28px_rgba(15,23,42,0.6)]">
      <template #start>
        <div class="flex items-center gap-2 md:gap-3">
          <Button
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            aria-label="Open menu"
            class="md:hidden"
            pt:root:class="h-10 w-10 rounded-full !bg-surface-100/80 dark:!bg-surface-800/80 !border-transparent hover:!bg-surface-200/80 dark:hover:!bg-surface-700/80"
            text
            @click="menuOpen = !menuOpen">
            <i class="pi pi-bars text-lg text-surface-700 dark:text-surface-100" />
          </Button>

          <NuxtLink
            :to="{ name: 'public-home' }"
            class="flex items-center gap-2">
            <img
              alt="Buddy Hub"
              class="h-10 w-10 md:h-11 md:w-11 rounded-2xl ring-1 ring-white/60 dark:ring-black/30 shadow-sm transition-transform duration-200 hover:scale-105"
              src="/png/logo-buddy-hub.png">
            <div class="hidden lg:block leading-tight">
              <span class="block text-sm font-semibold tracking-wide text-surface-900 dark:text-surface-0">Buddy Hub</span>
              <span class="block text-[0.65rem] uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400">Find your vibe</span>
            </div>
          </NuxtLink>
        </div>
      </template>

      <template #center>
        <nav
          aria-label="Primary"
          class="hidden sm:flex items-center gap-1 rounded-full px-1.5 py-1 bg-white/70 dark:bg-surface-900/60 border border-surface-200/70 dark:border-surface-800/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-lg">
          <NuxtLink
            :aria-current="isActive('public-home') ? 'page' : undefined"
            :to="{ name: 'public-home' }">
            <SecondaryButton
              :class="navClass('public-home')"
              icon="pi pi-home"
              label="Home"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="hidden lg:inline text-black dark:text-white"
              pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-chat', 'public-chat-id') ? 'page' : undefined"
            :to="{ name: 'public-chat' }">
            <OverlayBadge
              :show="unreadCount > 0"
              :value="unreadCount">
              <SecondaryButton
                :class="navClass('public-chat', 'public-chat-id')"
                icon="pi pi-comment"
                label="Chats"
                pt:icon:class="text-black dark:text-white"
                pt:label:class="hidden lg:inline text-black dark:text-white"
                pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
                text />
            </OverlayBadge>
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-find-match') ? 'page' : undefined"
            :to="{ name: 'public-find-match' }">
            <SecondaryButton
              :class="navClass('public-find-match')"
              icon="pi pi-link"
              label="Find Match"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="hidden lg:inline text-black dark:text-white"
              pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-rent') ? 'page' : undefined"
            :to="{ name: 'public-rent' }"
            class="hidden md:inline-flex">
            <SecondaryButton
              :class="navClass('public-rent')"
              icon="pi pi-wallet"
              label="Rent"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="hidden lg:inline text-black dark:text-white"
              pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-friends') ? 'page' : undefined"
            :to="{ name: 'public-friends' }">
            <SecondaryButton
              :class="navClass('public-friends')"
              icon="pi pi-users"
              label="Friends"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="hidden lg:inline text-black dark:text-white"
              pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-profile') ? 'page' : undefined"
            :to="{ name: 'public-profile' }"
            class="hidden md:inline-flex">
            <SecondaryButton
              :class="navClass('public-profile')"
              icon="pi pi-user"
              label="Profile"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="hidden lg:inline text-black dark:text-white"
              pt:root:class="h-10 w-10 lg:w-auto lg:h-10 px-0 lg:px-4 gap-0 lg:gap-2 rounded-full text-sm !bg-transparent !border-transparent transition-all duration-200 hover:!bg-surface-100/80 dark:hover:!bg-surface-800/70"
              text />
          </NuxtLink>
        </nav>
      </template>

      <template #end>
        <div class="flex items-center gap-2 md:gap-3">
          <CoinBalance
            v-if="authStore.user.id"
            class=""
            @topup="router.push({ name: 'public-vip' })" />
          <div class="hidden md:flex items-center">
            <ToggleSwitchMode class="pt-1" />
          </div>

          <Notification v-if="authStore.user.id" />
          <AvatarProfile v-if="authStore.user.id" />

          <NuxtLink
            v-else
            :to="{ name: 'auth-verify' }">
            <Button
              class="hidden sm:inline-flex bg-gradient-primary text-white"
              icon="pi pi-sign-in"
              icon-pos="right"
              label="Login"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="rounded-full px-4 py-2 text-sm !border-transparent shadow-[0_10px_30px_-20px_rgba(59,130,246,0.8)]" />
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
        aria-label="Close menu"
        class="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm md:hidden"
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
        id="mobile-menu"
        aria-label="Mobile navigation"
        aria-modal="true"
        class="fixed top-0 left-0 z-[110] h-full w-80 md:hidden bg-white dark:bg-black border-r border-slate-200/80 dark:border-slate-850/80 shadow-2xl"
        role="dialog">
        <div class="relative overflow-hidden px-4 py-4">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(120deg,rgba(59,130,246,0.18),transparent)] dark:bg-[linear-gradient(120deg,rgba(59,130,246,0.12),transparent)]" />
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-2">
              <img
                alt="Buddy Hub"
                class="h-10 w-10 rounded-2xl ring-1 ring-white/60 dark:ring-black/30"
                src="/png/logo-buddy-hub.png">
              <div>
                <span class="block text-sm font-semibold text-surface-900 dark:text-surface-0">Buddy Hub</span>
                <span class="block text-[0.65rem] uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400">Menu</span>
              </div>
            </div>
            <Button
              aria-label="Close menu"
              icon="pi pi-times"
              pt:root:class="h-9 w-9 rounded-full !bg-surface-100/80 dark:!bg-surface-800/80 !border-transparent"
              text
              @click="menuOpen = false" />
          </div>
        </div>

        <nav class="px-4 py-4 space-y-2">
          <NuxtLink
            :aria-current="isActive('public-home') ? 'page' : undefined"
            :to="{ name: 'public-home' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-home')"
              class="justify-start w-full"
              icon="pi pi-home"
              label="Home"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-chat', 'public-chat-id') ? 'page' : undefined"
            :to="{ name: 'public-chat' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-chat')"
              class="justify-start w-full"
              icon="pi pi-comment"
              label="Chats"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-find-match') ? 'page' : undefined"
            :to="{ name: 'public-find-match' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-find-match')"
              class="justify-start w-full"
              icon="pi pi-link"
              label="Find Match"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-rent') ? 'page' : undefined"
            :to="{ name: 'public-rent' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-rent')"
              class="justify-start w-full"
              icon="pi pi-wallet"
              label="Rent"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-friends') ? 'page' : undefined"
            :to="{ name: 'public-friends' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-friends')"
              class="justify-start w-full"
              icon="pi pi-users"
              label="Friends"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>

          <NuxtLink
            :aria-current="isActive('public-profile') ? 'page' : undefined"
            :to="{ name: 'public-profile' }"
            @click="menuOpen = false">
            <SecondaryButton
              :class="drawerNavClass('public-profile')"
              class="justify-start w-full"
              icon="pi pi-user"
              label="Profile"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-start rounded-2xl"
              text />
          </NuxtLink>
        </nav>

        <div class="px-4 pb-5 pt-1 space-y-3">
          <div class="rounded-2xl border border-surface-200/70 dark:border-surface-800/70 p-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium uppercase tracking-[0.2em] text-surface-500 dark:text-surface-400">Theme</span>
              <ToggleSwitchMode />
            </div>
          </div>

          <NuxtLink
            v-if="!authStore.user.id"
            :to="{ name: 'auth-verify' }"
            @click="menuOpen = false">
            <Button
              class="w-full bg-gradient-primary text-white"
              icon="pi pi-sign-in"
              icon-pos="right"
              label="Login"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-black dark:text-white"
              pt:root:class="w-full justify-center rounded-2xl !border-transparent" />
          </NuxtLink>
        </div>
      </aside>
    </Transition>

    <MobileQuickNav :unread-count="unreadCount" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ToggleSwitchMode from '../input/ToggleSwitchMode.vue'
import AvatarProfile from './AvatarProfile.vue'
import CoinBalance from './CoinBalance.vue'
import MobileQuickNav from './MobileQuickNav.vue'
import Notification from './Notification.vue'
import { useChatStore } from '~/stores/Chat'
import Button from '~/volt/Button.vue'
import SecondaryButton from '~/volt/SecondaryButton.vue'
import Toolbar from '~/volt/Toolbar.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()

const unreadCount = computed((): number => chatStore.unreadCount)

const menuOpen = ref(false)

const route = useRoute()
const router = useRouter()

const isActive = (...pages: string[]): boolean => {
  return pages.includes(String(route.name))
}

const navClass = (...pages: string[]): string => {
  return isActive(...pages)
    ? 'bg-gradient-primary border-none text-white shadow-[0_10px_25px_-18px_rgba(59,130,246,0.9)] ring-1 ring-white/50 dark:ring-black/25'
    : 'text-surface-600 dark:text-surface-300'
}

const drawerNavClass = (page: string): string => {
  return isActive(page)
    ? 'bg-gradient-primary border-none text-white shadow-[0_12px_24px_-18px_rgba(59,130,246,0.9)]'
    : 'text-surface-600 dark:text-surface-300'
}
</script>
