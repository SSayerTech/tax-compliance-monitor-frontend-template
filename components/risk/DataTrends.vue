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

   <!-- Risk Events -->
   <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
     <h2 class="text-lg font-semibold mb-4">Risk Factors</h2>
     <div class="space-y-4">
       <div 
         v-for="item in eventsHistory" 
         :key="item.period"
         class="space-y-4"
       >
         <div class="text-sm text-gray-600">{{ formatPeriod(item.period) }}</div>
         <div 
           v-for="event in item.events" 
           :key="event.type"
           class="flex items-start p-4 rounded-lg"
           :class="eventBackground(event.type)"
         >
           <AlertTriangle 
             v-if="event.type === 'RISK_INCREASE'"
             class="w-5 h-5 mt-0.5 mr-3"
             :class="eventIconColor(event.type)"
           />
           <AlertCircle
             v-else
             class="w-5 h-5 mt-0.5 mr-3"
             :class="eventIconColor(event.type)"
           />
           <div>
             <p class="font-medium" :class="eventTextColor(event.type)">
               {{ event.description }}
             </p>
             <p class="text-sm mt-1" :class="eventTextColor(event.type)">
               Exposure: {{ formatCurrency(event.exposure) }}
             </p>
           </div>
         </div>
       </div>
     </div>
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
import { AlertTriangle, AlertCircle } from 'lucide-vue-next'
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

const eventsHistory = computed(() => 
 props.history.filter(period => period.events?.length)
)

const formatPeriod = (period: string) => {
 const date = new Date(period)
 return new Intl.DateTimeFormat('es-CL', { 
   year: 'numeric',
   month: 'long'
 }).format(date)
}

const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('es-CL', {
   style: 'currency',
   currency: 'CLP',
   maximumFractionDigits: 0
 }).format(amount)
}

const eventBackground = (type: string) => {
 switch (type) {
   case 'RISK_INCREASE': return 'bg-red-50'
   case 'LATE_FILING': return 'bg-yellow-50'
   case 'MISSING_DECLARATION': return 'bg-red-50'
   default: return 'bg-gray-50'
 }
}

const eventIconColor = (type: string) => {
 switch (type) {
   case 'RISK_INCREASE': return 'text-red-500'
   case 'LATE_FILING': return 'text-yellow-500'
   case 'MISSING_DECLARATION': return 'text-red-500'
   default: return 'text-gray-500'
 }
}

const eventTextColor = (type: string) => {
 switch (type) {
   case 'RISK_INCREASE': return 'text-red-800'
   case 'LATE_FILING': return 'text-yellow-800'
   case 'MISSING_DECLARATION': return 'text-red-800'
   default: return 'text-gray-800'
 }
}
</script>