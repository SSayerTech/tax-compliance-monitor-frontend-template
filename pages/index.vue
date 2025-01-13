// pages/index.vue
<template>
  <div class="space-y-6">
    <!-- Taxpayer Selector -->
    <TaxpayerSelector @select="onTaxpayerSelect" />

    <!-- Loading State -->
    <div v-if="loading" class="bg-blue-50 text-blue-800 p-4 rounded-lg">
      Loading data...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-800 p-4 rounded-lg">
      <p class="font-bold">Error loading data:</p>
      <p>{{ error.message }}</p>
      <p v-if="error.details" class="mt-2 text-sm">
        Details: {{ JSON.stringify(error.details) }}
      </p>
    </div>

    <!-- Content -->
    <template v-else-if="taxpayerData">
      <!-- Header -->
      <div class="mb-8">
        <p class="text-gray-600">{{ taxpayerData.taxpayer.name }} - Last updated: {{ formatDate(new Date()) }}</p>
      </div>

      <!-- Risk Scores and Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Overall Risk - Wide card -->
        <div class="lg:col-span-3">
          <RiskCard
            :data="overallRiskData"
            size="large"
          />
        </div>

        <!-- Right side cards -->
        <div class="lg:col-span-2 grid grid-cols-1 gap-6">
          <!-- VAT Risk -->
          <RiskCard
            :data="vatRiskData"
            size="compact"
          />

          <!-- Income Tax Risk -->
          <RiskCard
            :data="incomeTaxRiskData"
            size="compact"
          />
        </div>
      </div>

      <!-- Trends -->
      <DataTrends
        v-if="taxpayerData.history"
        :history="taxpayerData.history"
      />
    </template>

    <!-- No Data State -->
    <div v-else class="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
      No data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { formatDate } from '@/utils/format';
import type { RiskCardData } from '@/types/risk';
import RiskCard from '@/components/risk/RiskCard.vue';
import DataTrends from '~/components/risk/DataTrends.vue';
import TaxpayerSelector from '@/components/TaxpayerSelector.vue';

const currentTaxpayerId = ref<string>('TP001');
const { taxpayerData, loading, error, fetchData } = useRiskData();

const onTaxpayerSelect = async (taxpayerId: string) => {
  currentTaxpayerId.value = taxpayerId;
  await fetchData(taxpayerId);
};

// Debug logging
watch(() => loading.value, (newVal) => {
  console.log('Loading state changed:', newVal);
});

watch(() => error.value, (newVal) => {
  console.log('Error state changed:', newVal);
  if (newVal) {
    console.error('Error details:', newVal);
  }
});

watch(() => taxpayerData.value, (newVal) => {
  console.log('Taxpayer data changed:', newVal);
});

// Fetch data on mount
onMounted(async () => {
  console.log('Component mounted, fetching data...');
  try {
    await fetchData(currentTaxpayerId.value);
  } catch (e) {
    console.error('Error in fetchData:', e);
  }
});

// Transform data for risk cards with debug logging
const overallRiskData = computed<RiskCardData>(() => {
  const data: RiskCardData = {
    type: 'OVERALL' as const,  // explicitly type as literal
    score: taxpayerData.value?.riskProfile.overall.score ?? 0,
    previousScore: taxpayerData.value?.riskProfile.overall.previousScore,
    exposure: taxpayerData.value?.riskProfile.overall.exposure ?? 0
  };
  console.log('Overall risk data computed:', data);
  return data;
});

const vatRiskData = computed<RiskCardData>(() => {
  const data: RiskCardData = {
    type: 'VAT' as const,  // explicitly type as literal
    score: taxpayerData.value?.riskProfile.components.vat.score ?? 0,
    exposure: taxpayerData.value?.riskProfile.components.vat.exposure ?? 0,
    lastFiled: taxpayerData.value?.riskProfile.components.vat.lastFiled,
    nextDue: taxpayerData.value?.riskProfile.components.vat.nextDue
  };
  console.log('VAT risk data computed:', data);
  return data;
});

const incomeTaxRiskData = computed<RiskCardData>(() => {
  const data: RiskCardData = {
    type: 'INCOME_TAX' as const,  // explicitly type as literal
    score: taxpayerData.value?.riskProfile.components.incomeTax.score ?? 0,
    exposure: taxpayerData.value?.riskProfile.components.incomeTax.exposure ?? 0,
    lastFiled: taxpayerData.value?.riskProfile.components.incomeTax.lastFiled,
    nextDue: taxpayerData.value?.riskProfile.components.incomeTax.nextDue
  };
  console.log('Income tax risk data computed:', data);
  return data;
});
</script>