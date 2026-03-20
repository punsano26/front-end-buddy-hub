<template>
  <div>
    <Toolbar pt:root="p-4 bg-surface-900 border-none rounded-none">
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
          <SecondaryButton
            label="Home"
            text />
          <SecondaryButton
            label="Chats"
            text />
          <SecondaryButton
            label="Friends"
            text />
          <SecondaryButton
            label="Profile"
            text />
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <img
            alt="Notifications"
            class="w-6 h-6"
            src="/svg/mdi-light--bell.svg">
          <AvatarProfile />
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

const menuOpen = ref(false)
</script>
