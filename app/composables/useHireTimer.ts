import { ref, computed, onUnmounted, watch, toValue } from 'vue'
import type { Ref, ComputedRef, MaybeRefOrGetter } from 'vue'

export interface IUseHireTimer {
  remainingSeconds: Ref<number>
  minutes: ComputedRef<number>
  seconds: ComputedRef<number>
  isExpired: Ref<boolean>
  formattedTime: ComputedRef<string>
}

export function useHireTimer (session: MaybeRefOrGetter<{ expiresAt: string | null } | null | undefined>): IUseHireTimer {
  const remainingSeconds = ref<number>(0)
  const isExpired = ref<boolean>(false)
  let timerInterval: any = null

  function calculateTime (): void {
    const s = toValue(session)
    const val = s?.expiresAt
    if (!val) {
      remainingSeconds.value = 0
      isExpired.value = true
      return
    }

    const expiryTime = new Date(val).getTime()
    const now = Date.now()
    const diff = Math.max(0, Math.floor((expiryTime - now) / 1000))

    remainingSeconds.value = diff
    isExpired.value = diff <= 0
  }

  function startInterval (): void {
    stopInterval()
    calculateTime()

    if (isExpired.value) {
      return
    }

    timerInterval = setInterval((): void => {
      calculateTime()
      if (isExpired.value) {
        stopInterval()
      }
    }, 1000)
  }

  function stopInterval (): void {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  watch(
    (): string | null => toValue(session)?.expiresAt ?? null, (): void => {
      startInterval()
    }, { immediate: true }
  )

  onUnmounted((): void => {
    stopInterval()
  })

  const minutes = computed((): number => {
    return Math.floor(remainingSeconds.value / 60)
  })

  const seconds = computed((): number => {
    return remainingSeconds.value % 60
  })

  const formattedTime = computed((): string => {
    const mm = String(minutes.value).padStart(2, '0')
    const ss = String(seconds.value).padStart(2, '0')
    return `${mm}:${ss}`
  })

  return {
    remainingSeconds,
    minutes,
    seconds,
    isExpired,
    formattedTime
  }
}

export default useHireTimer
