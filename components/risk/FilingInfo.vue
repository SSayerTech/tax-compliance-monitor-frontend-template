//components/risk/FilingInfo.vue
<template>
  <div class="mt-4 pt-4 border-t w-full">
    <div class="flex items-center justify-between" :class="[
      size === 'compact' ? 'text-xs' : 'text-sm',
      'text-gray-600'
    ]">
      <div class="flex items-center">
        <CalendarCheck :class="iconClasses" class="mr-2" />
        <span>Last Filed: {{ formatDate(lastFiled) }}</span>
      </div>
      <div class="flex items-center">
        <Clock :class="iconClasses" class="mr-2" />
        <span>Due: {{ formatDate(dueDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CalendarCheck, Clock } from 'lucide-vue-next';
import { formatDate } from '@/utils/format';
import type { CardSize } from '@/types/components';

const props = defineProps<{
  size?: CardSize;
  lastFiled: string;
  dueDate: string;
}>();

const iconClasses = computed(() => ({
  'w-3 h-3': props.size === 'compact',
  'w-4 h-4': props.size !== 'compact'
}));
</script>