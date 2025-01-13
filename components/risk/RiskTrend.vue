//components/risk/RiskTrend.vue
<template>
  <div class="mt-2 flex items-center space-x-1">
    <TrendingUp
      v-if="trend === 'up'"
      :class="iconClasses"
      class="text-red-500"
    />
    <TrendingDown
      v-else
      :class="iconClasses"
      class="text-green-500"
    />
    <span :class="[
      'text-gray-600',
      size === 'compact' ? 'text-xs' : 'text-sm'
    ]">
      {{ trend === 'up' ? 'Increased' : 'Decreased' }} from {{ previousScore }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';
import type { CardSize } from '@/types/components';

const props = defineProps<{
  size?: CardSize;
  currentScore: number;
  previousScore: number;
}>();

const trend = computed(() => 
  props.currentScore > props.previousScore ? 'up' : 'down'
);

const iconClasses = computed(() => ({
  'w-3 h-3': props.size === 'compact',
  'w-4 h-4': props.size !== 'compact'
}));
</script>