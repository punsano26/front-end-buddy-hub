<template>
  <nav
    aria-label="Quick navigation"
    class="sm:hidden fixed bottom-3 left-0 right-0 z-30 px-3">
    <div class="mx-auto max-w-md rounded-[1.6rem] border border-surface-200/60 dark:border-surface-800/70 bg-white/90 dark:bg-surface-950/85 backdrop-blur-xl shadow-[0_24px_60px_-36px_rgba(15,23,42,0.75)]">
      <div class="grid grid-cols-5 gap-2 p-2">
        <NuxtLink
          :aria-current="isActive('public-home') ? 'page' : undefined"
          :to="{ name: 'public-home' }">
          <SecondaryButton
            :class="mobileNavClass('public-home')"
            class="w-full"
            icon="pi pi-home"
            label="Home"
            pt:icon:class="text-black dark:text-white"
            pt:label:class="text-[0.6rem] tracking-wide text-black dark:text-white"
            pt:root:class="h-12 w-full flex-col gap-0.5 rounded-2xl border border-transparent bg-transparent"
            text />
        </NuxtLink>

        <NuxtLink
          :aria-current="isActive('public-chat', 'public-chat-id') ? 'page' : undefined"
          :to="{ name: 'public-chat' }">
          <div class="relative w-full">
            <SecondaryButton
              :class="mobileNavClass('public-chat', 'public-chat-id')"
              class="w-full"
              icon="pi pi-comment"
              label="Chats"
              pt:icon:class="text-black dark:text-white"
              pt:label:class="text-[0.6rem] tracking-wide text-black dark:text-white"
              pt:root:class="h-12 w-full flex-col gap-0.5 rounded-2xl border border-transparent bg-transparent"
              text />
            <span
              v-if="unreadCount > 0"
              class="absolute right-2 top-1.5 min-w-4 rounded-full bg-surface-900 text-white text-[0.55rem] leading-4 px-1 text-center dark:bg-surface-50 dark:text-surface-900">
              {{ unreadCount }}
            </span>
          </div>
        </NuxtLink>

        <NuxtLink
          :aria-current="isActive('public-find-match') ? 'page' : undefined"
          :to="{ name: 'public-find-match' }">
          <SecondaryButton
            :class="mobileNavClass('public-find-match')"
            class="w-full"
            icon="pi pi-link"
            label="Match"
            pt:icon:class="text-black dark:text-white"
            pt:label:class="text-[0.6rem] tracking-wide text-black dark:text-white"
            pt:root:class="h-12 w-full flex-col gap-0.5 rounded-2xl border border-transparent bg-transparent"
            text />
        </NuxtLink>

        <NuxtLink
          :aria-current="isActive('public-friends') ? 'page' : undefined"
          :to="{ name: 'public-friends' }">
          <SecondaryButton
            :class="mobileNavClass('public-friends')"
            class="w-full"
            icon="pi pi-users"
            label="Friends"
            pt:icon:class="text-black dark:text-white"
            pt:label:class="text-[0.6rem] tracking-wide text-black dark:text-white"
            pt:root:class="h-12 w-full flex-col gap-0.5 rounded-2xl border border-transparent bg-transparent"
            text />
        </NuxtLink>

        <NuxtLink
          :aria-current="isActive('public-profile') ? 'page' : undefined"
          :to="{ name: 'public-profile' }">
          <SecondaryButton
            :class="mobileNavClass('public-profile')"
            class="w-full"
            icon="pi pi-user"
            label="Profile"
            pt:icon:class="text-black dark:text-white"
            pt:label:class="text-[0.6rem] tracking-wide text-black dark:text-white"
            pt:root:class="h-12 w-full flex-col gap-0.5 rounded-2xl border border-transparent bg-transparent"
            text />
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import SecondaryButton from '~/volt/SecondaryButton.vue'

interface Props {
  unreadCount: number
}

defineProps<Props>()

const route = useRoute()

const isActive = (...pages: string[]): boolean => {
  return pages.includes(String(route.name))
}

const mobileNavClass = (...pages: string[]): string => {
  return isActive(...pages)
    ? 'bg-gradient-primary text-white shadow-[0_12px_26px_-18px_rgba(59,130,246,0.85)] ring-1 ring-white/40 dark:ring-white/10'
    : 'text-surface-800 dark:text-surface-200 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/80 dark:hover:bg-surface-800/70'
}
</script>
