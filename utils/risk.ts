import type { RiskLevel } from '@/types/risk';
import { RISK_LEVEL_COLORS } from '@/constants/theme';

export const getRiskLevel = (score: number): RiskLevel => {
  if (score <= 40) return 'LOW';
  if (score <= 70) return 'MEDIUM';
  return 'HIGH';
};

export const getRiskLevelColors = (score: number) => {
  const level = getRiskLevel(score);
  return RISK_LEVEL_COLORS[level];
};