// components/risk/Trends.vue
<template>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Risk Score Trends -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Risk Score Trends</h2>
      <div style="height: 300px">
        <Line
          v-if="history.length"
          :data="scoreChartData"
          :options="scoreChartOptions"
        />
      </div>
    </div>

    <!-- Exposure Trends -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Exposure Trends</h2>
      <div style="height: 300px">
        <Line
          v-if="history.length"
          :data="exposureChartData"
          :options="exposureChartOptions"
        />
      </div>
    </div>

   <!-- Risk Factors -->
   <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
     <h2 class="text-lg font-semibold mb-4">Risk Factors</h2>
     <!-- TODO: display risk events from history data
          Each HistoricalRiskData entry may contain an events array.
          Each RiskEvent has: type (LATE_FILING | MISSING_DECLARATION | RISK_INCREASE),
          description: string, and exposure: number.
          Events should be grouped by period, with clear visual distinction between types. -->
   </div>
 </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { ChartOptions, TooltipItem } from 'chart.js'
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
} from 'chart.js'
import type { HistoricalRiskData } from '~/types/risk'

ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Title,
 Tooltip,
 Legend
)

const props = defineProps<{
 history: HistoricalRiskData[]
}>()

const scoreChartData = computed(() => ({
 labels: [...props.history].reverse().map(h => h.period),
 datasets: [
   {
     label: 'Overall',
     data: [...props.history].reverse().map(h => h.overallScore),
     borderColor: '#6366F1',
     tension: 0.1
   },
   {
     label: 'VAT',
     data: [...props.history].reverse().map(h => h.vatScore),
     borderColor: '#F59E0B',
     tension: 0.1
   },
   {
     label: 'Income Tax',
     data: [...props.history].reverse().map(h => h.incomeTaxScore),
     borderColor: '#10B981',
     tension: 0.1
   }
 ]
}))

const exposureChartData = computed(() => ({
 labels: [...props.history].reverse().map(h => h.period),
 datasets: [{
   label: 'Total Exposure',
   data: [...props.history].reverse().map(h => h.totalExposure),
   borderColor: '#6366F1',
   tension: 0.1
 }]
}))

const scoreChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear',
      beginAtZero: true,
      max: 100
    }
  }
}

const exposureChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear',
      ticks: {
        callback: function(value) {
          if (typeof value === 'number') {
            return formatCurrency(value)
          }
          return ''
        }
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context: TooltipItem<'line'>) {
          return formatCurrency(Number(context.raw))
        }
      }
    }
  }
}

const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('es-CL', {
   style: 'currency',
   currency: 'CLP',
   maximumFractionDigits: 0
 }).format(amount)
}
</script>