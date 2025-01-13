import { computed } from 'vue';
import { getRiskLevelColors } from '@/utils/risk';

export const useRiskColors = (score: number) => {
  const colors = computed(() => getRiskLevelColors(score));

  return {
    statusColor: computed(() => colors.value.badge),
    gaugeColor: computed(() => colors.value.gauge),
    textColor: computed(() => colors.value.text)
  };
};