export const RISK_LEVEL_COLORS = {
  LOW: {
    badge: 'bg-green-100 text-green-800',
    gauge: 'stroke-green-500',
    text: 'text-green-600'
  },
  MEDIUM: {
    badge: 'bg-yellow-100 text-yellow-800',
    gauge: 'stroke-yellow-500',
    text: 'text-yellow-600'
  },
  HIGH: {
    badge: 'bg-red-100 text-red-800',
    gauge: 'stroke-red-500',
    text: 'text-red-600'
  }
} as const;