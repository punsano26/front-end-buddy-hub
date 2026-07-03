<template>
  <div class="flex flex-col gap-4">
    <!-- Header with tab selectors -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-0.5">
        <h3 class="text-base font-bold text-surface-900 dark:text-surface-0">
          แนวโน้มรายได้
        </h3>
        <p class="text-xs text-surface-500 dark:text-surface-400">
          {{ currentTab === 'weekly' ? '7 วันล่าสุด' : '30 วันล่าสุด' }}
        </p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex items-center gap-1 bg-surface-100 dark:bg-surface-800/80 p-1 rounded-xl text-xs font-semibold">
        <button
          :class="[
            currentTab === 'weekly'
              ? 'bg-surface-0 dark:bg-[#18181b] text-surface-900 dark:text-surface-0 shadow-xs'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          ]"
          class="cursor-pointer px-3.5 py-1.5 rounded-lg transition-all duration-200"
          type="button"
          @click="toggleTab('weekly')">
          7 วัน
        </button>
        <button
          :class="[
            currentTab === 'monthly'
              ? 'bg-surface-0 dark:bg-[#18181b] text-surface-900 dark:text-surface-0 shadow-xs'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100'
          ]"
          class="cursor-pointer px-3.5 py-1.5 rounded-lg transition-all duration-200"
          type="button"
          @click="toggleTab('monthly')">
          30 วัน
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

// Mock Data matching the mockup curve
const weeklySeries = [450, 460, 380, 950, 380, 950, 1180]
const monthlySeries = [8400, 12800, 9100, 14500, 18200, 17835]

const formatDayName = (dateStr: string): string => {
  const day = dayjs(dateStr).format('dddd')
  if (day === 'วันพฤหัสบดี') return 'พฤหัส'
  return day.replace(/^วัน/, '')
}

const chartData = computed((): { labels: string[], data: number[] } => {
  if (props.trends && props.trends.length > 0) {
    const limit = currentTab.value === 'weekly' ? 7 : 30
    const sliced = props.trends.slice(-limit)
    return {
      labels: sliced.map((t: IRevenueTrend): string => {
        try {
          if (currentTab.value === 'weekly') {
            return formatDayName(t.date)
          }
          return dayjs(t.date).format('DD/MM')
        } catch {
          return t.date
        }
      }),
      data: sliced.map((t: IRevenueTrend): number => t.revenue)
    }
  }

  const categories = currentTab.value === 'weekly'
    ? ['เสาร์', 'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์']
    : ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.']

  const data = currentTab.value === 'weekly' ? weeklySeries : monthlySeries

  return { labels: categories, data }
})

const getChartConfig = (): ChartConfiguration => {
  const textColor = isDark.value ? '#a1a1aa' : '#71717a'
  const gridColor = isDark.value ? 'rgba(39, 39, 42, 0.4)' : 'rgba(228, 228, 231, 0.6)'
  const categories = chartData.value.labels
  const data = chartData.value.data

  let lineGradient: any = '#10b981'
  let areaGradient: any = 'rgba(16, 185, 129, 0.05)'

  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      lineGradient = ctx.createLinearGradient(0, 0, canvasRef.value.width, 0)
      lineGradient.addColorStop(0, '#10b981')
      lineGradient.addColorStop(0.5, '#34d399')
      lineGradient.addColorStop(1, '#059669')

      areaGradient = ctx.createLinearGradient(0, 0, 0, 320)
      areaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.25)')
      areaGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)')
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
          pointBackgroundColor: '#10b981',
          pointBorderColor: isDark.value ? '#18181b' : '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10b981',
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
          backgroundColor: isDark.value ? '#18181b' : '#ffffff',
          titleColor: isDark.value ? '#ffffff' : '#18181b',
          bodyColor: isDark.value ? '#ffffff' : '#18181b',
          borderColor: isDark.value ? '#27272a' : '#e4e4e7',
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
