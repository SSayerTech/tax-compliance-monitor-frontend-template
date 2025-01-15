<template>
  <div :class="cardClass">
    <!-- Título del perfil de riesgo -->
    <h3 class="text-lg font-semibold mb-4 text-center">{{ data.type }} Risk Profile</h3>

    <!-- Componente del gauge de riesgo -->
    <RiskGauge :score="data.score" :size="size" />
    
    <div class="data-container">
      <!-- Tendencia de riesgo -->
      <div v-if="size === 'large'" class="trend-container">
        <RiskTrend 
          v-if="data.type === 'OVERALL'" 
          :current-score="data.score" 
          :previous-score="data.previousScore" 
        />
      </div>
      
      <!-- Exposición de riesgo -->
      <div v-if="data.exposure" class="text-center mt-4">
        <p class="font-semibold mb-4">{{ data.type }} Exposure 
          <br>${{ data.exposure }} 
        </p>
      </div>
      
      <!-- Información de presentación -->
      <FilingInfo 
        v-if="data.lastFiled && data.nextDue"
        :size="size"
        :last-filed="data.lastFiled"
        :due-date="data.nextDue"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import RiskGauge from './RiskGauge.vue';
import RiskTrend from './RiskTrend.vue';
import FilingInfo from './FilingInfo.vue';

// Props
const props = defineProps<{
  data: {
    type: string;
    score: number;
    exposure: string;
    previousScore?: number;
    lastFiled?: string;
    nextDue?: string;
  };
  size: 'large' | 'compact';
}>();

// Clase dinámica para el diseño del card
const cardClass = computed(() => ({
  'risk-card': true,
  'risk-card-large': props.size === 'large',
  'risk-card-compact': props.size === 'compact',
}));
</script>

<style scoped>
.risk-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra el contenido horizontalmente */
}

.risk-card-large {
  grid-column: span 3 / span 3;
}

.risk-card-compact {
  grid-column: span 1 / span 1;
}

.data-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 1rem;
}

.trend-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}
</style>
