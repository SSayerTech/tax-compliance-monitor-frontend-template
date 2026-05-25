//components/risk/RiskCard.vue
<template>
  <div class="bg-white rounded-lg shadow" :class="containerClasses">
    <!-- Header - Always at top -->
    <div class="flex justify-between items-start w-full mb-6">
      <h3 :class="titleClasses" class="font-semibold">
        {{ cardTitle }}
      </h3>
      <span class="px-2 py-1 rounded text-sm" :class="riskColors.badge">
        {{ getRiskLevel(data.score) }} Risk
      </span>
    </div>

    <!-- Centered content -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <RiskGauge
        :size="size"
        :score="data.score"
        :colors="{ gauge: riskColors.gauge, text: riskColors.text }"
      />

      <div class="mt-4 text-center">
        <div :class="exposureTitleClasses" class="font-semibold text-gray-700">
          {{ exposureTitle }}
        </div>
        <div :class="[
          `font-bold ${riskColors.text}`,
          exposureValueClasses
        ]">
          {{ formatCurrency(data.exposure) }}
        </div>
      </div>

      <RiskTrend
        v-if="data.previousScore"
        :size="size"
        :current-score="data.score"
        :previous-score="data.previousScore"
      />
    </div>

    <FilingInfo
      v-if="data.lastFiled && data.nextDue"
      :size="size"
      :last-filed="data.lastFiled"
      :due-date="data.nextDue"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '@/utils/format';
import type { RiskCardData, RiskLevel } from '@/types/risk';
import type { CardSize } from '@/types/components';
import RiskGauge from './RiskGauge.vue';
import RiskTrend from './RiskTrend.vue';
import FilingInfo from './FilingInfo.vue';

const props = defineProps<{
  data: RiskCardData;
  size?: CardSize;
}>();

// Risk level calculation
const getRiskLevel = (score: number): RiskLevel => {
  if (score <= 40) return 'LOW';
  if (score <= 70) return 'MEDIUM';
  return 'HIGH';
};

// Risk colors
const riskColors = computed(() => {
  const level = getRiskLevel(props.data.score);
  switch (level) {
    case 'LOW':
      return {
        badge: 'bg-green-100 text-green-800',
        gauge: 'stroke-green-500',
        text: 'text-green-600'
      };
    case 'MEDIUM':
      return {
        badge: 'bg-yellow-100 text-yellow-800',
        gauge: 'stroke-yellow-500',
        text: 'text-yellow-600'
      };
    case 'HIGH':
      return {
        badge: 'bg-red-100 text-red-800',
        gauge: 'stroke-red-500',
        text: 'text-red-600'
      };
  }
});

// Style classes
const containerClasses = computed(() => ({
  'p-8 h-full flex flex-col justify-center items-center': props.size === 'large',
  'p-3': props.size === 'compact',
  'p-6': props.size === 'default' || !props.size
}));

const titleClasses = computed(() => ({
  'text-xl': props.size === 'large',
  'text-sm': props.size === 'compact',
  'text-lg': props.size === 'default' || !props.size
}));

const exposureTitleClasses = computed(() => ({
  'text-xl': props.size === 'large',
  'text-sm': props.size === 'compact',
  'text-lg': props.size === 'default' || !props.size
}));

const exposureValueClasses = computed(() => ({
  'text-3xl': props.size === 'large',
  'text-lg': props.size === 'compact',
  'text-2xl': props.size === 'default' || !props.size
}));

// Content
const cardTitle = computed(() => {
  if (props.data.type === 'OVERALL') return 'Overall Risk Profile';
  if (props.data.type === 'VAT') return 'Value Added Tax Risk Profile';
  return 'Income Tax Risk Profile';
});

const exposureTitle = computed(() => {
  if (props.data.type === 'OVERALL') return 'Total Exposure';
  if (props.data.type === 'VAT') return 'Value Added Tax Exposure';
  return 'Income Tax Exposure';
});
</script>