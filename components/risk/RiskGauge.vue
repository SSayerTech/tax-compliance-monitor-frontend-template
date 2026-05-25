//components/risk/RiskGauge.vue
<template>
  <div class="relative inline-flex items-center justify-center">
    <svg :class="sizeClasses" class="transform -rotate-90">
      <circle
        class="stroke-gray-200"
        stroke-width="8"
        fill="none"
        :cx="dimensions.cx"
        :cy="dimensions.cy"
        :r="dimensions.radius"
      />
      <circle
        :class="colors.gauge"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
        :cx="dimensions.cx"
        :cy="dimensions.cy"
        :r="dimensions.radius"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="absolute flex flex-col items-center">
      <span :class="[
        `font-bold ${colors.text}`,
        scoreClasses
      ]">{{ score }}%</span>
      <span :class="[
        'text-gray-500',
        size === 'compact' ? 'text-xs' : 'text-sm'
      ]">Risk Score</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CardSize } from '@/types/components';

const props = defineProps<{
  size?: CardSize;
  score: number;
  colors: {
    gauge: string;
    text: string;
  };
}>();

const dimensions = computed(() => {
  switch (props.size) {
    case 'large':
      return { cx: 112, cy: 112, radius: 108 };
    case 'compact':
      return { cx: 56, cy: 56, radius: 52 };
    default:
      return { cx: 80, cy: 80, radius: 76 };
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'w-56 h-56';
    case 'compact':
      return 'w-28 h-28';
    default:
      return 'w-40 h-40';
  }
});

const scoreClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'text-4xl';
    case 'compact':
      return 'text-2xl';
    default:
      return 'text-3xl';
  }
});

const circumference = computed(() => 
  2 * Math.PI * dimensions.value.radius
);

const dashOffset = computed(() => 
  circumference.value - (props.score / 100) * circumference.value
);
</script>