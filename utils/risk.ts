import type { RiskLevel } from '@/types/risk';
import { RISK_LEVEL_COLORS } from '@/constants/theme';

export const getRiskLevel = (score: number): RiskLevel => {
  // TODO: Implement risk level calculation
  return 'MEDIUM';
};

export const getRiskLevelColors = (score: number) => {
  // TODO: Implement color scheme logic
  return RISK_LEVEL_COLORS.MEDIUM;
};