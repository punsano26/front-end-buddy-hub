<template>
  <div class="flex flex-col gap-4">
    <!-- Header with tab selectors -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-col">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">
          สถิติรายได้สะสม
        </h3>
        <div class="flex items-baseline gap-2 mt-1">
          <span class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {{ totalEarnings.toLocaleString() }}
          </span>
          <span class="text-sm font-medium text-slate-500 dark:text-slate-400">
            เหรียญ
          </span>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div
        v-if="!trends || trends.length === 0"
        class="flex items-center gap-1 self-start bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-xs font-semibold sm:self-center">
        <button
          :class="[
            currentTab === 'weekly'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          ]"
          class="cursor-pointer px-3 py-1.5 rounded-full transition-all duration-250"
          type="button"
          @click="toggleTab('weekly')">
          รายสัปดาห์
        </button>
        <button
          :class="[
            currentTab === 'monthly'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          ]"
          class="cursor-pointer px-3 py-1.5 rounded-full transition-all duration-250"
          type="button"
          @click="toggleTab('monthly')">
          รายเดือน
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div style="position: relative; width: 100%; height: 320px;">
      <canvas
        ref="canvasRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ChartConfiguration } from 'chart.js'
import dayjs from 'dayjs'
import type { IRevenueTrend } from '~/models/response/DasboardRes.model'

const props = defineProps<{
  trends?: IRevenueTrend[]
}>()

const currentTab = ref<'weekly' | 'monthly'>('weekly')
const isDark = ref<boolean>(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ChartJS: typeof import('chart.js').Chart | null = null
let chart: InstanceType<typeof import('chart.js').Chart> | null = null
let observer: MutationObserver | null = null

// Mock Data
const weeklySeries: {
  name: string
  data: number[]
}[] = [
  {
    name: 'รายได้ (เหรียญ)',
    data: [1200, 3500, 2800, 4200, 3100, 5600, 4800]
  }
]

const monthlySeries: {
  name: string
  data: number[]
}[] = [
  {
    name: 'รายได้ (เหรียญ)',
    data: [15400, 22800, 19100, 24500, 28200, 31600]
  }
]

const chartData = computed((): { labels: string[], data: number[] } => {
  if (props.trends && props.trends.length > 0) {
    return {
      labels: props.trends.map((t: IRevenueTrend): string => {
        try {
          return dayjs(t.date).format('DD/MM')
        } catch {
          return t.date
        }
      }),
      data: props.trends.map((t: IRevenueTrend): number => t.revenue)
    }
  }

  const categories = currentTab.value === 'weekly'
    ? ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
    : ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.']

  const data = currentTab.value === 'weekly'
    ? (weeklySeries[0]?.data ?? [])
    : (monthlySeries[0]?.data ?? [])

  return { labels: categories, data }
})

const totalEarnings = computed((): number => {
  if (props.trends && props.trends.length > 0) {
    return props.trends.reduce((acc: number, curr: IRevenueTrend): number => acc + curr.revenue, 0)
  }
  const data = currentTab.value === 'weekly' ? (weeklySeries[0]?.data ?? []) : (monthlySeries[0]?.data ?? [])
  return data.reduce((acc: number, curr: number): number => acc + curr, 0)
})

const getChartConfig = (): ChartConfiguration => {
  const textColor = isDark.value ? '#94a3b8' : '#64748b'
  const gridColor = isDark.value ? '#334155' : '#e2e8f0'
  const categories = chartData.value.labels
  const data = chartData.value.data

  // Create gradients if ctx is available
  let lineGradient: any = '#6366f1'
  let areaGradient: any = 'rgba(99, 102, 241, 0.1)'

  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      lineGradient = ctx.createLinearGradient(0, 0, canvasRef.value.width, 0)
      lineGradient.addColorStop(0, '#6366f1')
      lineGradient.addColorStop(1, '#8b5cf6')

      areaGradient = ctx.createLinearGradient(0, 0, 0, 320)
      areaGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)')
      areaGradient.addColorStop(1, 'rgba(139, 92, 246, 0.01)')
    }
  }

  return {
    type: 'line',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'รายได้ (เหรียญ)',
          data: data,
          fill: true,
          backgroundColor: areaGradient,
          borderColor: lineGradient,
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: isDark.value ? '#1e293b' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#6366f1',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
          titleColor: isDark.value ? '#f1f5f9' : '#0f172a',
          bodyColor: isDark.value ? '#f1f5f9' : '#0f172a',
          borderColor: isDark.value ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          titleFont: {
            family: 'Athiti, sans-serif',
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: 'Athiti, sans-serif',
            size: 13,
            weight: '500'
          },
          displayColors: false,
          callbacks: {
            label: (context: any): string => {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += Number(context.parsed.y).toLocaleString()
              }
              return label
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Athiti, sans-serif',
              size: 13,
              weight: '500'
            }
          },
          border: {
            display: false
          }
        },
        y: {
          grid: {
            color: gridColor,
            tickBorderDash: [4, 4]
          },
          ticks: {
            color: textColor,
            font: {
              family: 'Athiti, sans-serif',
              size: 13,
              weight: '500'
            },
            callback: (val: any): string => {
              return Number(val).toLocaleString()
            }
          },
          border: {
            display: false
          }
        }
      }
    }
  }
}

const updateChart = (): void => {
  if (chart && ChartJS && canvasRef.value) {
    chart.destroy()
    chart = new ChartJS(canvasRef.value, getChartConfig())
  }
}

watch([isDark, currentTab, (): IRevenueTrend[] | undefined => props.trends], (): void => {
  updateChart()
}, { deep: true })

const checkDarkMode = (): void => {
  isDark.value = document.documentElement.classList.contains('app-dark')
}

const toggleTab = (tab: 'weekly' | 'monthly'): void => {
  currentTab.value = tab
}

onMounted(async (): Promise<void> => {
  checkDarkMode()
  if (typeof window !== 'undefined') {
    observer = new MutationObserver((): void => {
      checkDarkMode()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }

  // Dynamically import chart.js to avoid SSR issues (Canvas API is browser-only)
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  ChartJS = Chart

  await nextTick()
  if (canvasRef.value) {
    chart = new ChartJS(canvasRef.value, getChartConfig())
  }
})

onUnmounted((): void => {
  if (observer) {
    observer.disconnect()
  }
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>
