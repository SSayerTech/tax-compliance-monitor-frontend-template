<template>
  <div class="risk-gauge-container">
    <div class="gauge" :style="{ background: backgroundColor }">
      <span class="score">{{ score }}%</span>
    </div>
    <p class="risk-level" :style="{ color: riskColor }">{{ riskLevel }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// Props
const props = defineProps<{ score: number }>();

// Background color gradient based on score
const backgroundColor = computed(() => {
  if (props.score > 70) return 'conic-gradient(#FF6B6B 0% 70%, #ECEFF1 70% 100%)';
  if (props.score > 40) return 'conic-gradient(#FFA726 0% 40%, #ECEFF1 40% 100%)';
  return 'conic-gradient(#66BB6A 0% 40%, #ECEFF1 40% 100%)';
});

// Risk level text
const riskLevel = computed(() => {
  if (props.score > 70) return 'High Risk';
  if (props.score > 40) return 'Medium Risk';
  return 'Low Risk';
});

// Risk level color
const riskColor = computed(() => {
  if (props.score > 70) return '#FF6B6B';
  if (props.score > 40) return '#FFA726';
  return '#66BB6A';
});
</script>

<style scoped>
.risk-gauge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.gauge {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.score {
  font-size: 1.5rem;
  font-weight: 600;
  color: #37474F;
}

.risk-level {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
