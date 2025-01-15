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

// Nueva función para manejar posibles errores de la API
const fetchTaxpayers = async () => {
  try {
    const response = await api.fetchTaxpayers();
    
    // Depuración: imprime la respuesta de la API
    console.log('API Response:', response);
    
    if (response.data && Array.isArray(response.data)) {
      // Ajuste aquí: accedemos al objeto 'taxpayer' de cada elemento
      taxpayers.value = response.data.map((item: { taxpayer: TaxpayerInfo }) => item.taxpayer);
      // Si hay contribuyentes y no se ha seleccionado uno, seleccionar el primero
      if (taxpayers.value.length > 0 && !selectedId.value) {
        selectedId.value = taxpayers.value[0].id;
        emit('select', selectedId.value);
      }
    } else {
      console.error('Error: Invalid data structure or no data received');
    }
  } catch (error) {
    console.error('Error fetching taxpayers:', error);
  }
};

onMounted(fetchTaxpayers);

// Método para manejar el cambio en el select
const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  selectedId.value = value;
  emit('select', value);
};
</script>
