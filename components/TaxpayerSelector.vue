// components/TaxpayerSelector.vue
<template>
  <div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow mb-6">
    <label class="text-gray-700 font-medium">Select Taxpayer:</label>
    <select
      :value="selectedId"
      class="form-select rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      @change="onChange($event)"
    >
      <option v-for="taxpayer in taxpayers" :key="taxpayer.id" :value="taxpayer.id">
        {{ taxpayer.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { TaxpayerInfo } from '@/types/risk';
import { useRiskApi } from '@/composables/useRiskApi';

const props = defineProps<{
  initialId?: string;
}>();

const emit = defineEmits<{
  (e: 'select', value: string): void;
}>();

const api = useRiskApi();
const taxpayers = ref<TaxpayerInfo[]>([]);
const selectedId = ref(props.initialId || '');

const fetchTaxpayers = async () => {
  const response = await api.fetchTaxpayers();
  if (response.data) {
    taxpayers.value = response.data;
    if (taxpayers.value.length > 0 && !selectedId.value) {
      selectedId.value = taxpayers.value[0].id;
      emit('select', selectedId.value);
    }
  }
};

onMounted(fetchTaxpayers);

const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  selectedId.value = value;
  emit('select', value);
};
</script>