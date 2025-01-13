// components/risk/RiskCard.vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <!-- TODO: Implement risk display -->
    <h3 class="text-lg font-semibold mb-4">{{ data.type }} Risk Profile</h3>
    <div class="flex-1 flex flex-col items-center justify-center">
      <!-- TODO: Add RiskGauge component -->
      <!-- TODO: Add risk exposure information -->
      <!-- TODO: Add RiskTrend component -->
    </div>
    <FilingInfo v-if="data.lastFiled && data.nextDue"
      :size="size"
      :last-filed="data.lastFiled"
      :due-date="data.nextDue"
    />
  </div>
</template>

<script setup lang="ts">
import type { RiskCardData } from '@/types/risk';
import type { CardSize } from '~/types/components';

defineProps<{
  data: RiskCardData;
  size?: CardSize;
}>();

// TODO: Implement risk level calculation and styling
</script>