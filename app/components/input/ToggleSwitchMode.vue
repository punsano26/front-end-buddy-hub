<template>
  <div class="relative inline-block align-middle">
    <!-- Custom Toggle Design -->
    <button
      :aria-checked="checked"
      :aria-label="checked ? 'Switch to day mode' : 'Switch to night mode'"
      :class="checked ? 'bg-linear-to-br from-slate-900 via-blue-900 to-slate-800' : 'bg-linear-to-br from-amber-200 via-sky-200 to-emerald-200'"
      class="relative w-12 h-6 rounded-full overflow-hidden transition-all duration-700 ease-in-out cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.25)] ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      role="switch"
      type="button"
      @click="toggleMode">
      <div
        :class="checked ? 'opacity-30' : 'opacity-70'"
        class="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_100%_at_0%_0%,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0)_55%)]" />
      <div
        :class="checked ? 'opacity-20' : 'opacity-50'"
        class="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_60%)]" />
      <!-- Stars (Night Mode) -->
      <div
        :class="checked ? 'opacity-100' : 'opacity-0'"
        class="absolute inset-0 transition-opacity duration-700 pointer-events-none">
        <div
          v-for="star in stars"
          :key="star.id"
          :style="{
            width: star.size + 'px',
            height: star.size + 'px',
            top: star.top + '%',
            left: star.left + '%',
            animationDelay: star.delay + 's'
          }"
          class="absolute bg-white/80 rounded-full animate-twinkle" />
      </div>

      <!-- Clouds (Day Mode) -->
      <div
        :class="!checked ? 'opacity-100' : 'opacity-0'"
        class="absolute inset-0 transition-opacity duration-700 pointer-events-none">
        <svg
          v-for="cloud in clouds"
          :key="cloud.id"
          :style="{
            width: cloud.width + 'px',
            top: cloud.top + '%',
            left: cloud.left + '%',
            animationDelay: cloud.delay + 's',
            animationDuration: cloud.duration + 's'
          }"
          class="absolute text-white/60 drop-shadow-[0_2px_6px_rgba(255,255,255,0.35)] animate-float"
          fill="currentColor"
          viewBox="0 0 100 50">
          <ellipse
            cx="25"
            cy="35"
            rx="25"
            ry="15" />
          <ellipse
            cx="45"
            cy="28"
            rx="20"
            ry="18" />
          <ellipse
            cx="65"
            cy="33"
            rx="22"
            ry="14" />
        </svg>
      </div>

      <!-- Butterfly (Day Mode) -->
      <div
        :class="!checked ? 'opacity-100 left-6 top-1' : 'opacity-0 left-1.5 top-1'"
        :style="{ transitionDelay: checked ? '0s' : '0.4s' }"
        class="absolute transition-all duration-700 pointer-events-none">
        <svg
          class="w-2.5 h-2.5 animate-flutter opacity-90"
          fill="none"
          viewBox="0 0 24 24">
          <path
            d="M12 4C10 4 8.5 5.5 8 7C7.5 8.5 7 10 7 12C7 10 6.5 8.5 6 7C5.5 5.5 4 4 2 4C4 4 5.5 5.5 6 7C6.5 8.5 7 10 7 12C7 14 6.5 15.5 6 17C5.5 18.5 4 20 2 20C4 20 5.5 18.5 6 17C6.5 15.5 7 14 7 12C7 14 7.5 15.5 8 17C8.5 18.5 10 20 12 20C10 20 8.5 18.5 8 17C7.5 15.5 7 14 7 12C7 14 7.5 15.5 8 17C8.5 18.5 10 20 12 20C14 20 15.5 18.5 16 17C16.5 15.5 17 14 17 12C17 14 17.5 15.5 18 17C18.5 18.5 20 20 22 20C20 20 18.5 18.5 18 17C17.5 15.5 17 14 17 12C17 10 17.5 8.5 18 7C18.5 5.5 20 4 22 4C20 4 18.5 5.5 18 7C17.5 8.5 17 10 17 12C17 10 16.5 8.5 16 7C15.5 5.5 14 4 12 4Z"
            fill="url(#butterfly-gradient)" />
          <defs>
            <linearGradient
              id="butterfly-gradient"
              x1="0%"
              x2="100%"
              y1="0%"
              y2="100%">
              <stop
                offset="0%"
                style="stop-color:#FF6B9D;stop-opacity:1" />
              <stop
                offset="100%"
                style="stop-color:#FEC163;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Firefly (Night Mode) -->
      <div
        :class="checked ? 'opacity-100 left-6 top-1.5' : 'opacity-0 left-1.5 top-1.5'"
        :style="{ transitionDelay: !checked ? '0s' : '0.4s' }"
        class="absolute transition-all duration-700 pointer-events-none">
        <div class="relative">
          <div class="w-1 h-1 bg-yellow-200 rounded-full animate-glow" />
          <div class="absolute inset-0 w-1 h-1 bg-yellow-100 rounded-full blur-sm animate-glow" />
        </div>
      </div>

      <!-- Toggle Knob (Sun/Moon) -->
      <div
        :class="checked ? 'translate-x-6' : 'translate-x-0'"
        class="absolute left-0.5 top-1/2 -translate-y-1/2 transition-transform duration-700 ease-in-out">
        <div
          :class="checked ? 'bg-slate-100/90' : 'bg-white/90'"
          class="relative w-5 h-5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)] ring-1 ring-white/70">
          <div
            :class="checked ? 'opacity-70' : 'opacity-40'"
            class="absolute inset-0 rounded-full bg-[radial-gradient(120%_120%_at_30%_20%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_60%)]" />
          <svg
            v-if="checked"
            class="absolute inset-0 m-auto w-3 h-3 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
            viewBox="0 0 24 24">
            <defs>
              <radialGradient id="toggle-moon-gradient">
                <stop
                  offset="0%"
                  style="stop-color:#FFF3C4;stop-opacity:1" />
                <stop
                  offset="100%"
                  style="stop-color:#D8C58D;stop-opacity:1" />
              </radialGradient>
            </defs>
            <circle
              cx="12"
              cy="12"
              fill="url(#toggle-moon-gradient)"
              r="8" />
            <circle
              cx="9"
              cy="9"
              fill="rgba(150,130,80,0.35)"
              r="1.6" />
            <circle
              cx="15"
              cy="14"
              fill="rgba(150,130,80,0.35)"
              r="1.2" />
          </svg>
          <svg
            v-else
            class="absolute inset-0 m-auto w-3 h-3 drop-shadow-[0_0_6px_rgba(255,200,0,0.7)]"
            viewBox="0 0 24 24">
            <defs>
              <radialGradient id="toggle-sun-gradient">
                <stop
                  offset="0%"
                  style="stop-color:#FFF4A6;stop-opacity:1" />
                <stop
                  offset="100%"
                  style="stop-color:#FDBA74;stop-opacity:1" />
              </radialGradient>
            </defs>
            <circle
              cx="12"
              cy="12"
              fill="url(#toggle-sun-gradient)"
              r="5.8" />
            <g
              opacity="0.9"
              stroke="#FDBA74"
              stroke-linecap="round"
              stroke-width="1.5">
              <line
                x1="12"
                x2="12"
                y1="2.8"
                y2="5.2" />
              <line
                x1="12"
                x2="12"
                y1="18.8"
                y2="21.2" />
              <line
                x1="2.8"
                x2="5.2"
                y1="12"
                y2="12" />
              <line
                x1="18.8"
                x2="21.2"
                y1="12"
                y2="12" />
            </g>
          </svg>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type Star = {
  id: number
  size: number
  top: number
  left: number
  delay: number
}

type Cloud = {
  id: number
  width: number
  top: number
  left: number
  delay: number
  duration: number
}

type Props = {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined
})

const storedTheme = useState<'light' | 'dark' | null>('theme-mode-storage', (): 'light' | 'dark' | null => null)
const globalDarkMode = useState<boolean>('theme-mode-is-dark', (): boolean => false)
const themeInitialized = useState<boolean>('theme-mode-initialized', (): boolean => false)

const checked = computed<boolean>({
  get (): boolean {
    return typeof props.modelValue === 'boolean' ? props.modelValue : globalDarkMode.value
  },
  set (value: boolean): void {
    globalDarkMode.value = value
    emit('update:modelValue', value)
    applyTheme(value)
  }
})

// ⭐ Generate random stars
const stars = ref<Star[]>(
  Array.from({ length: 10 }, (_: unknown, i: number): Star => ({
    id: i,
    size: (Math.random() * 1.2) + 0.6,
    top: (Math.random() * 60) + 20,
    left: (Math.random() * 75) + 10,
    delay: Math.random() * 2.5
  }))
)

// ☁️ Generate clouds
const clouds = ref<Cloud[]>(
  Array.from({ length: 2 }, (_: unknown, i: number): Cloud => ({
    id: i,
    width: (Math.random() * 8) + 14,
    top: (Math.random() * 30) + 10,
    left: (Math.random() * 45) + 8,
    delay: Math.random() * 1.5,
    duration: (Math.random() * 2) + 3.5
  }))
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function applyTheme (isDark: boolean): void {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('app-dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
  localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')
}

function resolveInitialMode (): boolean {
  if (!import.meta.client) {
    return false
  }

  const persistedMode = localStorage.getItem('theme-mode')
  storedTheme.value = persistedMode === 'dark' || persistedMode === 'light' ? persistedMode : null

  if (storedTheme.value) {
    return storedTheme.value === 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function initializeTheme (): void {
  const initialMode = typeof props.modelValue === 'boolean'
    ? props.modelValue
    : resolveInitialMode()

  globalDarkMode.value = initialMode
  applyTheme(initialMode)
  themeInitialized.value = true
}

function toggleMode (): void {
  checked.value = !checked.value
}

watch((): boolean | undefined => props.modelValue, (value: boolean | undefined): void => {
  if (typeof value === 'boolean') {
    globalDarkMode.value = value
    applyTheme(value)
  }
})

watch((): boolean => globalDarkMode.value, (value: boolean): void => {
  if (typeof props.modelValue !== 'boolean') {
    applyTheme(value)
  }
})

onMounted((): void => {
  if (!themeInitialized.value) {
    initializeTheme()
    return
  }

  applyTheme(checked.value)
})
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes flutter {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-3px) rotate(-5deg); }
  75% { transform: translateY(-3px) rotate(5deg); }
}

@keyframes glow {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-flutter {
  animation: flutter 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 1.5s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
</style>
