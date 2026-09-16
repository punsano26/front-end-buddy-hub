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
      <div class="flex gap-3 items-start w-full pr-7">
        <i
          :class="[
            'text-xl mt-0.5 shrink-0',
            {
              'pi pi-check-circle text-emerald-400': slotProps.message.severity === 'success',
              'pi pi-info-circle text-blue-400': slotProps.message.severity === 'info',
              'pi pi-exclamation-triangle text-amber-400': slotProps.message.severity === 'warn',
              'pi pi-times-circle text-rose-400': slotProps.message.severity === 'error'
            }
          ]" />
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm sm:text-base tracking-wide break-words">
            {{ slotProps.message.summary }}
          </div>
          <div class="text-xs sm:text-sm opacity-80 leading-relaxed break-words mt-0.5">
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
  type ToastPassThroughMethodOptions,
  type ToastPassThroughOptions,
  type ToastProps
} from 'primevue/toast'

interface Props extends /* @vue-ignore */ ToastProps {}
defineProps<Props>()

const theme = ref<ToastPassThroughOptions>({
  root: (options?: ToastPassThroughMethodOptions): string => {
    const position = options?.props?.position || 'top-right'
    const isBottom = position.startsWith('bottom')
    const isCenter = position === 'center'

    return [
      'p-toast z-[1100] max-w-full',
      // Mobile (< sm): full width with safe margin on left and right
      isBottom
        ? '!bottom-4 !top-auto !left-4 !right-4 !w-auto'
        : isCenter
          ? '!top-1/2 !left-4 !right-4 !-translate-y-1/2 !w-auto'
          : '!top-4 !bottom-auto !left-4 !right-4 !w-auto',
      // Tablet / Desktop (>= sm): fixed w-96 max-w-md and proper placement
      'sm:!w-96 sm:max-w-md',
      position === 'top-left' || position === 'bottom-left'
        ? 'sm:!left-5 sm:!right-auto'
        : position === 'top-center'
          ? 'sm:!left-1/2 sm:!-translate-x-1/2 sm:!right-auto'
          : position === 'bottom-center'
            ? 'sm:!left-1/2 sm:!-translate-x-1/2 sm:!right-auto sm:!bottom-5'
            : position === 'center'
              ? 'sm:!left-1/2 sm:!top-1/2 sm:!-translate-x-1/2 sm:!-translate-y-1/2 sm:!right-auto sm:!bottom-auto'
              : position === 'bottom-right'
                ? 'sm:!right-5 sm:!left-auto sm:!bottom-5'
                : 'sm:!right-5 sm:!left-auto sm:!top-5'
    ].join(' ')
  },

  message: `
    relative overflow-hidden
    rounded-2xl border
    backdrop-blur-xl
    shadow-lg
    transition-all duration-300
    w-full

    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-br before:opacity-30

    sm:hover:scale-[1.02] hover:shadow-xl

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
    w-full
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
