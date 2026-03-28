<template>
  <Toast
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge
    }"
    unstyled>
    <template #closeicon>
      <TimesIcon />
    </template>

    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps">
      <slot
        :name="slotName"
        v-bind="slotProps ?? {}" />
    </template>
    <template #message="slotProps">
      <div class="flex gap-3 items-start">
        <i
          :class="[
            'text-xl mt-1',
            {
              'pi pi-check-circle text-emerald-400': slotProps.message.severity === 'success',
              'pi pi-info-circle text-blue-400': slotProps.message.severity === 'info',
              'pi pi-exclamation-triangle text-amber-400': slotProps.message.severity === 'warn',
              'pi pi-times-circle text-rose-400': slotProps.message.severity === 'error'
            }
          ]" />
        <div>
          <div class="font-semibold">
            {{ slotProps.message.summary }}
          </div>
          <div class="text-sm opacity-80">
            {{ slotProps.message.detail }}
          </div>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TimesIcon from '@primevue/icons/times'
import { ptViewMerge } from './utils'
import Toast, {
  type ToastPassThroughOptions,
  type ToastProps
} from 'primevue/toast'

interface Props extends /* @vue-ignore */ ToastProps {}
defineProps<Props>()

const theme = ref<ToastPassThroughOptions>({
  root: `
    md:w-[20vw] w-96
    px-2 sm:px-0
  `,

  message: `
    relative overflow-hidden
    rounded-2xl border
    backdrop-blur-xl
    shadow-lg
    transition-all duration-300

    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-br before:opacity-30

    hover:scale-[1.02] hover:shadow-xl

    p-info:bg-blue-500/10 p-info:border-blue-400/30
    p-success:bg-emerald-500/10 p-success:border-emerald-400/30
    p-warn:bg-amber-500/10 p-warn:border-amber-400/30
    p-error:bg-rose-500/10 p-error:border-rose-400/30

    dark:p-info:bg-blue-400/10
    dark:p-success:bg-emerald-400/10
    dark:p-warn:bg-amber-400/10
    dark:p-error:bg-rose-400/10
  `,

  messageContent: `
    relative z-10
    flex items-start gap-3 p-4
  `,

  messageIcon: `
    flex-shrink-0
    text-xl mt-1
    opacity-90
  `,

  messageText: `
    flex flex-col gap-1
  `,

  summary: `
    font-semibold text-sm sm:text-base
    tracking-wide
  `,

  detail: `
    text-xs sm:text-sm
    opacity-80
    leading-relaxed
  `,

  closeButton: `
    absolute top-2 right-2
    w-7 h-7 flex items-center justify-center
    rounded-full
    bg-white/10 hover:bg-white/20
    backdrop-blur-md
    transition-all duration-200

    hover:scale-110 active:scale-95
  `,

  closeIcon: `
    w-4 h-4
  `,

  transition: {
    enterFromClass: `
      opacity-0 translate-y-6 scale-95
    `,
    enterActiveClass: `
      transition-all duration-400 ease-out
    `,
    leaveFromClass: `
      opacity-100 scale-100
    `,
    leaveActiveClass: `
      transition-all duration-300 ease-in
    `,
    leaveToClass: `
      opacity-0 translate-y-4 scale-95
    `
  }
})
</script>
